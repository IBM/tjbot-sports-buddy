# tjbot-sports-buddy

[![Build Status](https://travis-ci.org/IBM/tjbot-sports-buddy.svg?branch=master)](https://travis-ci.org/IBM/tjbot-sports-buddy)

# Build a TJBot using Watson Services to talk about sports

In this developer journey we will build a TJBot that knows baseball. Using 
Watson Discovery, TJBot will give you insight about your favorite teams, such as
their current league standing, their upcoming shedule, and links to a few
relevant articles from Watson News.

When the reader has completed this journey, they will understand how to:

* Build a TJBot that converses using Watson Conversation
* Use Watson Text to Speech and Speech to Text services to converse with TJBot
* Use Watson Tone Analyzer to determine your sentiment about your favorite teams
* Use Watson Discovery News to find news articles about your favorite teams 
* Query 3rd party data sources to get the latest Major League Baseball (MLB) data
* Use Twilio to send SMS text messages with team schedules and news article links

ARCHITECTURE PICTURE

### With Watson

Want to take your Watson app to the next level? Looking to leverage Watson Brand assets? Join the [With Watson](https://www.ibm.com/watson/with-watson) program which provides exclusive brand, marketing, and tech resources to amplify and accelerate your Watson embedded commercial solution.

## Included Components
- Bluemix Watson Conversation
- Bluemix Watson Discovery
- Bluemix Watson Text to Speech
- Bluemix Watson Speech to Text
- Bluemix Watson Tone Analyzer
- Twilio 
- MLB Fantasy Data service
- Node.js

# Steps

**NOTE:** Perform steps 1-6 **OR** click the ``Deploy to Bluemix`` button and hit ``Create`` and then jump to step 5.

> There is no web UI, so don't use the ``View app`` button to see the app. Use the Bluemix dashboard to find and manage the app. Use your TJBot to chat.


[![Deploy to Bluemix](https://deployment-tracker.mybluemix.net/stats/5fd641e32af04e4adb16f26c46de3587/button.svg)](https://bluemix.net/deploy?repository=https://github.com/IBM/watson-online-store&cm_mmc=github-code-_-native-_-retailchatbot-_-deploy2bluemix)

1. [Clone the repo](#1-clone-the-repo)
2. [Create Bluemix services](#2-create-bluemix-services)
3. [Configure Watson Conversation](#3-configure-watson-conversation)
4. [Configure Watson Discovery](#4-configure-watson-discovery)
5. [Configure Slack](#5-configure-slack)
6. [Run the application](#6-run-the-application)

## 1. Clone the repo

Clone the `tjbot-sports-buddy' locally. In a terminal, run:

  `$ git clone https://github.com/ibm/tjbot-sports-buddy`

We’ll be using the file [`data/workspace.json`](data/workspace.json)

## 2. Create Bluemix services

Create the following services:

  * [**Watson Conversation**](https://console.ng.bluemix.net/catalog/services/conversation)
  * [**Watson Discovery**](https://console.ng.bluemix.net/catalog/services/discovery)
  * [**Cloudant NoSQL DB**](https://console.ng.bluemix.net/catalog/services/cloudant-nosql-db/)

## 3. Configure Watson Conversation

Launch the **Watson Conversation** tool. Use the **import** icon button on the right

<p align="center">
  <img width="400" height="55" src="doc/source/images/import_conversation_workspace.png">
</p>

Find the local version of [`data/workspace.json`](data/workspace.json) and select
**Import**. Find the **Workspace ID** by clicking on the context menu of the new
workspace and select **View details**. Save this ID for later.

<p align="center">
  <img width="400" height="250" src="doc/source/images/open_conversation_menu.png">
</p>

*Optionally*, to view the conversation dialog select the workspace and choose the
**Dialog** tab, here's a snippet of the dialog:

![](doc/source/images/dialog.png)

## 4. Configure Watson Discovery

Launch the **Watson Discovery** tool. 

## 5. Configure Twilio

## 6. Configure MLB Fantasy Data Service

https://fantasydata.com

## 6. Run the application

### If you used the Deploy to Bluemix button...

If you used ``Deploy to Bluemix``, most of the setup is automatic, but not
quite all of it. We have to update a few environment variables.

In the Bluemix dashboard find the App that was created. Click on ``Runtime`` on the menu and navigate to the ``Environment variables`` tab.

![](doc/source/images/env_vars.png)

Update the following environment variables:

  * Twilio
  * MLB Fantasy Data

Save the new values and restart the application, watch the logs for errors.

### If you decided to run the app locally...

Copy the [`config.new.js`](config.new.js) to `config.js`, edit it with the necessary IDs
and run the application.

The `USERNAME`, `PASSWORD`, and `URL` settings for each service can be obtained
from the `Service Credentials` tab in BlueMix. The other settings were collected
during the earlier setup steps.

```
$ cp config.new.js config.js
### edit config.js
$ node run.js
```

# Sample output


# Troubleshooting


# License

[Apache 2.0](LICENSE)

# Privacy Notice

If using the Deploy to Bluemix button some metrics are tracked, the following
information is sent to a [Deployment Tracker](https://github.com/IBM-Bluemix/cf-deployment-tracker-service) service
on each deployment:

* Python package version
* Python repository URL
* Application Name (application_name)
* Application GUID (application_id)
* Application instance index number (instance_index)
* Space ID (space_id)
* Application Version (application_version)
* Application URIs (application_uris)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the setup.py file in the sample application and the ``VCAP_APPLICATION``
and ``VCAP_SERVICES`` environment variables in IBM Bluemix and other Cloud Foundry platforms. This
data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to
measure the usefulness of our examples, so that we can continuously improve the content we offer
to you. Only deployments of sample applications that include code to ping the Deployment Tracker
service will be tracked.

## Disabling Deployment Tracking

To disable tracking, simply remove ``cf_deployment_tracker.track()`` from the
``run.py`` file in the top level directory.
