#!/bin/bash
FILE='./config.js'
/bin/cat <<EOM >$FILE
exports.STTUsername = '11111';
exports.STTPassword = '11111';
exports.ToneUsername = '11111';
exports.TonePassword = '11111';
exports.ConUsername = '11111';
exports.ConPassword = '11111';
exports.ConWorkspace = '11111'
exports.TTSUsername = '11111';
exports.TTSPassword = '11111';
exports.DiscoUsername = '11111';
exports.DiscoPassword = '11111';
exports.DiscoEnvironmentId = '11111';
exports.DiscoCollectionId = '11111';
exports.TwilioAccountSID = '11111'; 
exports.TwilioAuthToken = '11111'; 
exports.TwilioPhoneNo = '11111';
EOM
./node_modules/jshint/bin/jshint run.js
./node_modules/.bin/mocha tests
rm ./config.js