/* jshint esversion: 6 */

const WATSON = require('watson-developer-cloud');
const CONFIG = require('./config.js');
const FS = require('fs');
const MIC = require('mic');
const PLAYER = require('play-sound')(opts = {});
const PROBE = require('node-ffprobe');
const REQUEST = require('request-promise');
const PROMISE = require('promise');

const ATTENTION_WORD = CONFIG.attentionWord;
var mlbTeams;
var mlbTeamsRetrieved = false;
var mlbStandings;
var mlbStandingsRetrieved = false;
var mlbScheduleDates = [];
var mlbSchedule = [];
var scheduleDaysCollected = 0;
var mlbScheduleRetrieved = false;
var userPhoneNo = '';
var context = {};


/**
 * Create Watson Services.
 */
const SPEECH_TO_TEXT = WATSON.speech_to_text({
  username: CONFIG.STTUsername,
  password: CONFIG.STTPassword,
  version: 'v1'
});

const TONE_ANALYZER = WATSON.tone_analyzer({
  username: CONFIG.ToneUsername,
  password: CONFIG.TonePassword,
  version: 'v3',
  version_date: '2016-05-19'
});

const CONVERSATION = WATSON.conversation({
  username: CONFIG.ConUsername,
  password: CONFIG.ConPassword,
  version: 'v1',
  version_date: '2016-07-11'
});

const TEXT_TO_SPEECH = WATSON.text_to_speech({
  username: CONFIG.TTSUsername,
  password: CONFIG.TTSPassword,
  version: 'v1'
});

const DISCOVERY = WATSON.discovery({
  username: CONFIG.DiscoUsername,
  password: CONFIG.DiscoPassword,
  version: 'v1',
  version_date: '2016-11-07'
});


/**
 * Create Twilio Client.
 */
const TWILIO = require('twilio')(
  CONFIG.TwilioAccountSID, 
  CONFIG.TwilioAuthToken
); 
const TWILIO_PHONE_NO = CONFIG.TwilioPhoneNo;


/**
 * Retrieve key to 3rd party MLB data
 */
const MLB_DATA_KEY = CONFIG.MLBFantasySubscriptionKey;


/**
 * Create and configure the microphone.
 */
const MIC_PARAMS = { 
  rate: 44100, 
  channels: 2, 
  debug: false, 
  exitOnSilence: 6
};
const MIC_INSTANCE = MIC(MIC_PARAMS);
const MIC_INPUT_STREAM = MIC_INSTANCE.getAudioStream();

let pauseDuration = 0;
MIC_INPUT_STREAM.on('pauseComplete', ()=> {
  console.log('Microphone paused for', pauseDuration, 'seconds.');
  // Stop listening when speaker is talking.
  setTimeout(function() {
      MIC_INSTANCE.resume();
      console.log('Microphone resumed.');     
  }, Math.round(pauseDuration * 1000));
});


/**
 * Get current MLB team info from MLB Fantasy Data.
 */
function getMlbTeams() {
  const options = {
    method: 'GET',
    uri: 'https://api.fantasydata.net/mlb/v2/JSON/teams',
    headers: {
      'Host': 'api.fantasydata.net',
      'Ocp-Apim-Subscription-Key': MLB_DATA_KEY
    }
  };

  return new PROMISE((resolve, reject) => {
    REQUEST(options)
      .then(function (response) {
        mlbTeams = JSON.parse(response);
        return resolve();
      })
      .catch(function (err) {
        console.log('Unable to retrieve current MLB team info. ', err);
        return reject(err);
      });
  });
}


/**
 * Get current MLB standings from MLB Fantasy Data.
 */
function getMlbStandings() {
  const options = {
    method: 'GET',
    uri: 'https://api.fantasydata.net/mlb/v2/JSON/Standings/2017',
    headers: {
      'Host': 'api.fantasydata.net',
      'Ocp-Apim-Subscription-Key': MLB_DATA_KEY
    }
  };

  return new PROMISE((resolve, reject) => {
    REQUEST(options)
      .then(function (response) {
        mlbStandings = JSON.parse(response);
        return resolve();
      })
      .catch(function (err) {
        console.log('Unable to retrieve current MLB standings. ', err);
        return reject(err);
      });
  });
}


/**
 * Get current MLB schedules from MLB Fantasy Data. Just grab schedules
 * from today and for the next week.
 */
function getMlbSchedules() {
  var monthNames = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL',
    'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ];

  var date = new Date();

  return new PROMISE((resolve, reject) => {
    for (let i = 0; i < 7; i++) {
      /* jshint loopfunc: true */
      date.setDate(date.getDate() + 1);
      month = date.getMonth();
      day = ("0" + date.getDate()).slice(-2);
      const options = {
        method: 'GET',
        uri: 'https://api.fantasydata.net/mlb/v2/JSON/GamesByDate/2017-' + 
              monthNames[month] + '-' + day,
        headers: {
          'Host': 'api.fantasydata.net',
          'Ocp-Apim-Subscription-Key': MLB_DATA_KEY
        }
      };

      REQUEST(options)
        .then(function (response) {
          daySchedule = JSON.parse(response);
          console.log('Retrieved schedule for date: ' + daySchedule[0].Day);
          // Save each date in array so that they can be sorted 
          // after all dates are retrieved.
          mlbScheduleDates[mlbScheduleDates.length] = daySchedule;
          scheduleDaysCollected += 1;
          if (scheduleDaysCollected === 7) {
            return resolve();
          }
        })
        .catch(function (err) {
          console.log('Unable to retrieve current MLB schedules. ', err);
          return reject(err);
        });
    }
  });
}


/**
 * Sort the MLB schedule by date. This is needed because each day is
 * requested separately, and are returned in random order.
 */
function sortSchedule() {
  var date = new Date();
  var daysProcessed = 0;
  
  while (daysProcessed < 7) {
    date.setDate(date.getDate() + 1);
    for (let i = 0; i < mlbScheduleDates.length; i++) {
      if (mlbScheduleDates[i][0].Day.substring(5,10) === 
           date.toJSON().substring(5,10)) {
        mlbSchedule = mlbSchedule.concat(mlbScheduleDates[i]);
        daysProcessed += 1;
        break;
      }
    }
  }
}


/**
 * Get current MLB standings for a specific team.
 *
 * @param {String} team
 *   Team to get standings for.
 */
function getCurrentStandings(team, standingsData) {
  if (standingsData) {
    let places = ['first', 'second', 'third', 'fourth', 'last'];
    let placeIdx;
    let place = '';
    let div = '';
    for (let i = 0; i < standingsData.length; i++) {
      let currentDiv = standingsData[i].League + standingsData[i].Division;
      if (div === '' || div !== currentDiv) {
        div = currentDiv;
        placeIdx = 0;
      } else {
        placeIdx++;
      }
      place = places[placeIdx];

      let compTeam = standingsData[i].Name;
      if (team.indexOf(compTeam) > -1) {
        return place;
      }
    }

    return 'unknown';
  }
}
exports.getCurrentStandings = getCurrentStandings;


/**
 * Get upcoming MLB schedule for a specific team.
 * 
 * @param {String} team
 *   Team to get schedule for.
 */
function getUpcomingSchedule(team) {
  // First determine abbreviated team name required for looking at schedules.
  var teamKey = '';
  if (mlbTeams) {
    for (let i = 0; i < mlbTeams.length; i++) {
      let compTeam = mlbTeams[i].Name;
      if (team.indexOf(compTeam) > -1) {
        teamKey = mlbTeams[i].Key;
        break;
      }
    }
  }

  var schedString = 'No schedule data found for ' + team;
  if (teamKey && mlbSchedule) {
    var gameCount = 0;
    var date = new Date();
    schedString = 'Upcoming schedule for the ' + team + ':\n';
    while (gameCount < 5) {
      date.setDate(date.getDate() + 1);
      var foundDate = false;
      for (let i = 0; i < mlbSchedule.length; i++) {
        // Limit schedule to just next 5 games.
        if ((foundDate) || 
            (mlbSchedule[i].Day.substring(5,10) === 
            date.toJSON().substring(5,10))) {
          foundDate = true;
          var game = '';
          if (mlbSchedule[i].AwayTeam === teamKey) {
            game = mlbSchedule[i].DateTime.substring(5,10) +
              ' ' + mlbSchedule[i].DateTime.substring(11,16) +  
              ' @ ' + mlbSchedule[i].HomeTeam + '\n';
          } else if (mlbSchedule[i].HomeTeam === teamKey) {
            game = mlbSchedule[i].DateTime.substring(5,10) + 
              ' ' + mlbSchedule[i].DateTime.substring(11,16) +  
              ' vs. ' + mlbSchedule[i].AwayTeam + '\n';
          }
          if (game) {
            schedString = schedString.concat(game);
            gameCount += 1;
            break;
          }
        }
      }
    }

    console.log("schedString " + schedString);
    return schedString;
  }
}


/**
 * Convert phone number from words to numbers.
 * 
 * @param {String} spokenPhoneNumber
 *   Text of spoken phone number that needs to be converted to digits.
 */
function getUserPhoneNumber(spokenPhoneNumber) {
  // Spoken phone number is a space seperated string.
  var phoneNum = '+1';
  words = spokenPhoneNumber.split(' ');
  for (let i = 0; i < words.length; i++) {
    switch(words[i]) {
      case 'one':
        phoneNum = phoneNum + '1';
        break;
      case 'two':
        phoneNum = phoneNum + '2';
        break;
      case 'three':
        phoneNum = phoneNum + '3';
        break;
      case 'four':
        phoneNum = phoneNum + '4';
        break;
      case 'five':
        phoneNum = phoneNum + '5';
        break;
      case 'six':
        phoneNum = phoneNum + '6';
        break;
      case 'seven':
        phoneNum = phoneNum + '7';
        break;
      case 'eight':
        phoneNum = phoneNum + '8';
        break;
      case 'nine':
        phoneNum = phoneNum + '9';
        break;
      case 'zero':
        phoneNum = phoneNum + '0';
        break;
    }
  }

  return phoneNum;
}
exports.getUserPhoneNumber = getUserPhoneNumber;  // export for mocha unit tests

/**
 * Text team info to user.
 * This includes schedule, and Watson headlines
 */
function textTeamInfo() {
  // Validate phone number is legitimate.
  if (context.text_sent != 'success') {
    // Only use number if needed (first time or last time was with invalid #).
    textPhoneNo = getUserPhoneNumber(context.phoneno);
  }

  if (textPhoneNo.length != 12) {
    console.log('Unable to text: bad phone number: ', textPhoneNo);
    context.text_sent = 'failure';      
    return;
  }

  console.log('Will send text to: ', textPhoneNo);

  // Query for headlines from watson news.
  let headlines = [];
  const numHeadlines = 2;

  DISCOVERY.query({
    environment_id: CONFIG.DiscoEnvironmentId,
    collection_id: CONFIG.DiscoCollectionId,
    query: context.my_team + ' baseball', 
    count: 5
  }, (err, response) => {
    if (response.results) {
      for (let i = 0; i < response.results.length; i++) {
        // Make sure headline is not a duplicate, which Watson news 
        // does on occasion.
        headline = response.results[i].title + ' - ' + response.results[i].url;
        var dup = false;
        for (let j = 0; j < headlines.length; j++) {
          if (headline === headlines[j]) {
            dup = true;
            break;
          }
        }
        if (! dup) {
          headlines.push(headline);
          if (headlines.length >= numHeadlines) {
            break; 
          }          
        }
      }
    }

    // Get next 5 game schedule for team.
    sched = getUpcomingSchedule(context.my_team);

    // Text schedule to user.
    context.text_sent = 'success';      
    TWILIO.messages.create({     
        to: textPhoneNo,     
        from: TWILIO_PHONE_NO,     
        body: sched, 
    }, function(err, message) {
        console.log(message.sid); 
        // Now text each headline to user.
        for (let i = 0; i < headlines.length; i++) {
          /* jshint loopfunc: true */
          TWILIO.messages.create({     
              to: textPhoneNo,     
              from: TWILIO_PHONE_NO,     
              body: headlines[i],
          }, function(err, message) {
              console.log(message.sid); 
          });
      }
    });

    // Tell user text has been sent.
    console.log('Schedule and headlines have been sent');
    console.log('before call - context: ', context);
    CONVERSATION.message({
      workspace_id: CONFIG.ConWorkspace,
      input: {'text': ''},
      context: context
    }, (err, response) => {
      context = response.context;
      console.log('after call - context: ', context);
      watsonResponse = response.output.text[0];
      speakResponse(watsonResponse);
      console.log('Watson says:', watsonResponse);
    });
  });
}


/**
 * Convert speech to text.
 */
const textStream = MIC_INPUT_STREAM.pipe(
  SPEECH_TO_TEXT.createRecognizeStream({
    content_type: 'audio/l16; rate=44100; channels=2',
  })).setEncoding('utf8');


/**
 * Get emotional tone from speech.
 */
const getEmotion = (text) => {
  return new Promise((resolve) => {
    let maxScore = 0;
    let emotion = null;
    TONE_ANALYZER.tone({text: text}, (err, tone) => {
      let tones = tone.document_tone.tone_categories[0].tones;
      for (let i=0; i<tones.length; i++) {
        if (tones[i].score > maxScore){
          maxScore = tones[i].score;
          emotion = tones[i].tone_id;
        }
      }
      resolve({emotion, maxScore});
    });
  });
};


/**
 * Convert text to speech.
 */
const speakResponse = (text) => {
  const params = {
    text: text,
    voice: CONFIG.voice,
    accept: 'audio/wav'
  };
  TEXT_TO_SPEECH.synthesize(params)
  .pipe(FS.createWriteStream('output.wav'))
  .on('close', () => {
    PROBE('output.wav', function(err, probeData) {
      pauseDuration = probeData.format.duration + 0.2;
      MIC_INSTANCE.pause();
      PLAYER.play('output.wav');
    });
  });
};


/**
 * Check conversation step.
 * True if we are attempting to validate the team the user wishes to follow.
 */
function validateTeamStep() {
  if (context && 
      context.system && 
      context.system.dialog_stack[0] === 'Validate Team') {
    return true;
  }
  return false;
}


/**
 * Check conversation step.
 * True if we are attempting to validate the users team sentiment tone.
 */
function validateEmotionStep() {
  if (context && 
      context.system && 
      context.system.dialog_stack[0] === 'Validate Emotion') {
    return true;
  }
  return false;
}


/**
 * Check conversation step.
 * True if we are attempting to text team info to the user.
 */
function textTeamInfoStep() {
  if (context && 
      context.system && 
      context.system.dialog_stack[0] === 'Text Team Info') {
    return true;
  }
  return false;
}


/**
 * Watson conversation with user.
 */
function mlbConversation() {
  console.log('TJBot is listening, you may speak now.');
  speakResponse('Hi there, I am awake.');

  textStream.on('data', (user_speech_text) => {
    userSpeechText = user_speech_text.toLowerCase();
    console.log('\n\nWatson hears: ', user_speech_text);
    console.log('before call - context: ', context);
    CONVERSATION.message({
      workspace_id: CONFIG.ConWorkspace,
      input: {'text': user_speech_text},
      context: context
    }, (err, response) => {
      context = response.context;
      console.log('after call - context: ', context);

      watson_response =  response.output.text[0];
      if (watson_response) {
        speakResponse(watson_response);
      }
      console.log('Watson says:', watson_response);

      if (validateEmotionStep()) {
        // User has expressed sentiment about team.
        getEmotion(context.emotion).then((detectedEmotion) => {
          context.emotion = detectedEmotion.emotion;
          console.log('before call - context: ', context);
          CONVERSATION.message({
            workspace_id: CONFIG.ConWorkspace,
            input: {'text': userSpeechText},
            context: context
          }, (err, response) => {
            context = response.context;
            console.log('after call - context: ', context);
            watson_response =  response.output.text[0];
            speakResponse(watson_response);
            console.log('Watson says:', watson_response);
          });
        });
      } else if (validateTeamStep()) {
        // User has identified which team they want to follow.
        context.standings = getCurrentStandings(context.my_team, mlbStandings);
        console.log('before call - context: ', context);
        CONVERSATION.message({
          workspace_id: CONFIG.ConWorkspace,
          input: {'text': userSpeechText},
          context: context
        }, (err, response) => {
          context = response.context;
          console.log('after call - context: ', context);
          watson_response =  response.output.text[0];
          speakResponse(watson_response);
          console.log('Watson says:', watson_response);
        });
      } else if (textTeamInfoStep()) {
        // User has requested that team info be texted to them.
        textTeamInfo();
      }
    });
  });
}


/**
 * Load all MLB data and start conversation when completed.
 */
function init() {
    // Generate data to be used during the conversation.
    getMlbTeams()
      .then(function() {
        console.log('Retrieved MLB Teams');
        mlbTeamsRetrieved = true;
        startConversationIfReady();
      })
      .catch(err => {
        throw new Error('Error loading MLB team info');
      });
    getMlbStandings()
      .then(function() {
        console.log('Retrieved MLB standings');
        mlbStandingsRetrieved = true;
        startConversationIfReady();
      })
      .catch(err => {
        throw new Error('Error loading MLB standings');
      });
    getMlbSchedules()
      .then(function() {
        console.log('Retrieved MLB schedules');
        sortSchedule();
        mlbScheduleRetrieved = true;
        startConversationIfReady();
      })
      .catch(err => {
        throw new Error('Error loading MLB schedules');
      });
}


/**
 * Start the conversation once all MLB data is loaded.
 */
function startConversationIfReady() {
  if (mlbTeamsRetrieved && mlbStandingsRetrieved && mlbScheduleRetrieved) {
    // Initialize microphone    
    MIC_INSTANCE.start();

    // Begin watson conversation.
    mlbConversation();    
  }  
}

// Start by loading MLB data
init();
