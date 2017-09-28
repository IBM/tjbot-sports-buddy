// The attention word to wake up the robot.
exports.attentionWord = 'watson';

// MLB Season
exports.MLBSeason = '2017';
exports.offSeason = false;

// You can change the voice of the robot to your favorite voice.
exports.voice = 'en-US_MichaelVoice';
// Some of the available options are:
// en-US_AllisonVoice
// en-US_LisaVoice
// en-US_MichaelVoice (the default)

// Credentials for Watson Speech to Text service
exports.STTUsername = '';
exports.STTPassword = '';

// Credentials for Watson Conversation service
exports.ConUsername = '';
exports.ConPassword = '';
exports.ConWorkspace = ''

//Credentials for Watson Tone Analyzer service
exports.ToneUsername = '';
exports.TonePassword = '';

//Credentials for Watson Text to Speech service
exports.TTSUsername = '';
exports.TTSPassword = '';

// Credentials for Watson Discovery service
exports.DiscoUsername = '';
exports.DiscoPassword = '';
// NOTE: starting with v2017-08-01, the Watson News collection
// always uses the following IDs
exports.DiscoEnvironmentId = 'system';
exports.DiscoCollectionId = 'news';

// Twilio account data
exports.TwilioAccountSID = ''; 
exports.TwilioAuthToken = ''; 
// Include country code with following numbers, e.g. '+12223334444'
exports.TwilioPhoneNo = '';
// Only set this if you would like all texts being sent to one number
exports.UserPhoneNo = '';

// MLB Fantasy Sports Data
exports.MLBFantasySubscriptionKey = '';