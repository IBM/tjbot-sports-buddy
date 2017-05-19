#!/bin/bash

if ! ./node_modules/jshint/bin/jshint run.js
then
    exit 1
fi

FILE='./config.js'
/bin/cat <<EOM >$FILE
// set FAKE service credentials to make test happy
// Watson Speech To Text 
exports.STTUsername = 'edfd7341-315a-41zz-XXXb-a0b528430561';
exports.STTPassword = 'xGJlOXXXkLZK';
// Watson Tone Analyzer
exports.ToneUsername = '8327d4fa-2c6c-XXXX-9eaf-6634053c0e48';
exports.TonePassword = 'HXXX6BvqaGa6';
// Watson Conversation
exports.ConUsername = '30dce96d-XXXX-4b34-93e8-47ed27910dbe';
exports.ConPassword = 'F1ZNlvXXXXCy';
exports.ConWorkspace = 'f540548a-XXXX-4d48-b7ac-d25932493d24';
// Watson Text to Speech
exports.TTSUsername = '0b08XXXX-c678-4ebb-99c2-1f7ebe029ccb';
exports.TTSPassword = 'o8hhJAXXXXSe';
// Watson Discovery
exports.DiscoUsername = '97f508eb-XXXX-489e-a2ec-ad5baa0454c0';
exports.DiscoPassword = 'FT74XXXXFbkT';
exports.DiscoEnvironmentId = '1323e589-7b5b-49b0-87a5-43aedbXXXXa9';
exports.DiscoCollectionId = 'a2dd4607-50a2-48f6-XXXX-27f38587d651';
// Twilio Account
exports.TwilioAccountSID = 'AC0XXXXdb9ce1f07ebd6064f56c5d6e37a'; 
exports.TwilioAuthToken = 'a7b16830a0ttf13b8f28d44XXXX61a26'; 
exports.TwilioPhoneNo = '+19165555555';
EOM

./node_modules/.bin/mocha tests
retval=$?

rm ./config.js
exit $retval
