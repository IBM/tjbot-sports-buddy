#!/bin/bash

if ! ./node_modules/jshint/bin/jshint run.js
then
    exit 1
fi

FILE='./.env'
/bin/cat <<EOM >$FILE
IN_OFF_SEASON = 'true'
// set FAKE service credentials to make test happy
// Watson Speech To Text
SPEECH_TO_TEXT_IAM_APIKEY=edfd7341-315a-41zz-XXXb-a0b528430561
// Watson Tone Analyzer
TONE_ANALYZER_IAM_APIKEY=8327d4fa-2c6c-XXXX-9eaf-6634053c0e48
exports.TonePassword = 'HXXX6BvqaGa6';
// Watson Conversation
CONVERSATION_IAM_APIKEY=30dce96d-XXXX-4b34-93e8-47ed27910dbe
CONVERSATION_WORKSPACE_ID=f540548a-XXXX-4d48-b7ac-d25932493d24
// Watson Text to Speech
TEXT_TO_SPEECH_IAM_APIKEY=0b08XXXX-c678-4ebb-99c2-1f7ebe029ccb
// Watson Discovery
DISCOVERY_IAM_APIKEY=97f508eb-XXXX-489e-a2ec-ad5baa0454c0
// Twilio Account
TWILIO_SID=AC0XXXXdb9ce1f07ebd6064f56c5d6e37a
TWILIO_AUTH_TOKEN=a7b16830a0ttf13b8f28d44XXXX61a26
TWILIO_PHONE_NUMBER=+19165555555
EOM

# ./node_modules/.bin/mocha tests
# retval=$?

rm ./.env
exit $?
