#!/bin/bash

if ! ./node_modules/jshint/bin/jshint run.js
then
    exit 1
fi

FILE='./config.js'
/bin/cat <<EOM >$FILE
// set FAKE service credentials to make test happy
exports.credentials = {};
// Watson Speech To Text 
exports.credentials.speech_to_text = {
	username: 'edfd7341-315a-41zz-XXXb-a0b528430561',
	password: 'xGJlOXXXkLZK'
}
// Watson Tone Analyzer
exports.credentials.tone_analyzer = {
	username: '8327d4fa-2c6c-XXXX-9eaf-6634053c0e48',
	password: 'HXXX6BvqaGa6'
};
// Watson Conversation
exports.credentials.conversation = {
	username: '30dce96d-XXXX-4b34-93e8-47ed27910dbe',
	password: 'F1ZNlvXXXXCy'
};
exports.conversationWorkspaceId = 'f540548a-XXXX-4d48-b7ac-d25932493d24'; 
// Watson Text to Speech
exports.credentials.text_to_speech = {
	username: '0b08XXXX-c678-4ebb-99c2-1f7ebe029ccb',
	password: 'o8hhJAXXXXSe'
};
// Watson Discovery
exports.credentials.discovery = {
	username: '97f508eb-XXXX-489e-a2ec-ad5baa0454c0',
	password: 'FT74XXXXFbkT'
};
exports.discoEnvironmentId = 'system';
exports.discoCollectionId = 'news';
// Twilio Account
exports.TwilioAccountSID = 'AC0XXXXdb9ce1f07ebd6064f56c5d6e37a';
exports.TwilioAuthToken = 'a7b16830a0ttf13b8f28d44XXXX61a26';
exports.TwilioPhoneNo = '+19165555555';
EOM

./node_modules/.bin/mocha tests
retval=$?

rm ./config.js
exit $retval
