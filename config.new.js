// Output device
exports.outputType = 'TJBot';   
//exports.outputType = '';      // use this if testing on OSX hardware

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

// Create the credentials object for exporting Watson Service credentials
exports.credentials = {};

// Credentials for Watson Speech to Text service
exports.credentials.speech_to_text = {
	username: '',
	password: ''
}

// Credentials for Watson Conversation service
exports.credentials.conversation = {
	username: '',
	password: ''
};
exports.conversationWorkspaceId = ''; 

//Credentials for Watson Tone Analyzer service
exports.credentials.tone_analyzer = {
	username: '',
	password: ''
};

//Credentials for Watson Text to Speech service
exports.credentials.text_to_speech = {
	username: '',
	password: ''
};

// Credentials for Watson Discovery service
exports.credentials.discovery = {
	username: '',
	password: ''
};
// NOTE: starting with v2017-08-01, the Watson News collection
// always uses the following IDs
exports.discoEnvironmentId = 'system';
exports.discoCollectionId = 'news';

// Twilio account data
exports.TwilioAccountSID = ''; 
exports.TwilioAuthToken = ''; 
// Include country code with following numbers, e.g. '+12223334444'
exports.TwilioPhoneNo = '';
// Only set this if you would like all texts being sent to one number
exports.UserPhoneNo = '';

// MLB Fantasy Sports Data
exports.MLBFantasySubscriptionKey = '';