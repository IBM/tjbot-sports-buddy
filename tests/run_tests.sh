#!/bin/bash
FILE='./config.js'
/bin/cat <<EOM >$FILE
// set fake service credentials to make test happy
// Watson Speech To Text 
exports.STTUsername = 'edfd7341-315a-41zz-834b-a0b528430561';
exports.STTPassword = 'xGJlOXXXkLZK';
// Watson Tone Analyzer
exports.ToneUsername = '8327d4fa-2c6c-8888-9eaf-6634053c0e48';
exports.TonePassword = 'HXXX6BvqaGa6';
// Watson Conversation
exports.ConUsername = '30dce96d-6666-4b34-93e8-47ed27910dbe';
exports.ConPassword = 'F1ZNlvF0wCCy';
exports.ConWorkspace = 'f540548a-3333-4d48-b7ac-d25932493d24';
// Watson Text to Speech
exports.TTSUsername = '0b08accc-c678-4ebb-99c2-1f7ebe029ccb';
exports.TTSPassword = 'o8hhJAzzwKSe';
// Watson Discovery
exports.DiscoUsername = '97f508eb-4444-489e-a2ec-ad5baa0454c0';
exports.DiscoPassword = 'FT74mlpjFbkT';
exports.DiscoEnvironmentId = '1323e589-7b5b-49b0-87a5-43aedb5555a9';
exports.DiscoCollectionId = 'a2dd4607-50a2-48f6-7777-27f38587d651';
// Twilio Account
exports.TwilioAccountSID = 'AC02222db9ce1f07ebd6064f56c5d6e37a'; 
exports.TwilioAuthToken = 'a7b16830a0ttf13b8f28d44zz5b61a26'; 
exports.TwilioPhoneNo = '+19165555555';
EOM
./node_modules/jshint/bin/jshint run.js
./node_modules/.bin/mocha tests
rm ./config.js
