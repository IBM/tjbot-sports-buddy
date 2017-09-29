/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License'); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

 /* jshint esversion: 6 */

/**
 * This purpose of this script is to save off all MLB data for off-season use.
 * Files will written to the data directory with a '-new' suffix.
 * 
 * NOTE: this script should only be run during the season, when MLB 
 * data is available. 
 * 
 * Here are the steps needed to use these new files:
 * 1) Run this script
 * 2) If files are correct, overwrite existing versions:
 *    cp data/mlb-teams-new.json data/mlb-teams.json
 *    cp data/mlb-schedule-new.json data/mlb-schedule.json
 *    cp data/mlb-standings-new.json data/mlb-standings.json
 * 3) Set 'exports.offSeason = true;' in config.json
 * 4) Edit run.js function 'getCurrentDate()'. The date returned
 *    should be set to one day before the date when the new
 *    MLB data was saved off. Note that months start at 0.
*/

const CONFIG = require('../config.js');
const REQUEST = require('request-promise');
const PROMISE = require('promise');

const MLB_SEASON = CONFIG.MLBSeason;
var mlbTeams;
var mlbTeamsRetrieved = false;
var mlbStandings;
var mlbStandingsRetrieved = false;
var mlbScheduleDates = [];
var scheduleDaysCollected = 0;
var mlbSchedule = [];
var mlbScheduleRetrieved = false;


/**
 * Retrieve key to 3rd party MLB data
 */
const MLB_DATA_KEY = CONFIG.MLBFantasySubscriptionKey;


/**
 * Get current date
 */
function getCurrentDate() {
  var date;    
  date = new Date(MLB_SEASON, 8, 28);        
  return date;
}


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

        var jsonfile = require('jsonfile');
        var file = 'data/mlb-teams-new.json';
        jsonfile.writeFile(file, mlbTeams, {spaces: 2}, function (err) {
          console.error(err);
        });
  
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
    uri: 'https://api.fantasydata.net/mlb/v2/JSON/Standings/' + MLB_SEASON,
    headers: {
      'Host': 'api.fantasydata.net',
      'Ocp-Apim-Subscription-Key': MLB_DATA_KEY
    }
  };

  return new PROMISE((resolve, reject) => {
    REQUEST(options)
      .then(function (response) {
        mlbStandings = JSON.parse(response);

        var jsonfile = require('jsonfile');
        var file = 'data/mlb-standings-new.json';
        jsonfile.writeFile(file, mlbStandings, {spaces: 2}, function (err) {
          console.error(err);
        });

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

  var date = getCurrentDate();

  return new PROMISE((resolve, reject) => {
    for (let i = 0; i < 7; i++) {
      /* jshint loopfunc: true */
      date.setDate(date.getDate() + 1);
      month = date.getMonth();
      day = ("0" + date.getDate()).slice(-2);
      const options = {
        method: 'GET',
        uri: 'https://api.fantasydata.net/mlb/v2/JSON/GamesByDate/' + MLB_SEASON + '-' + 
              monthNames[month] + '-' + day,
        headers: {
          'Host': 'api.fantasydata.net',
          'Ocp-Apim-Subscription-Key': MLB_DATA_KEY
        }
      };

      REQUEST(options)
        .then(function (response) {
          daySchedule = JSON.parse(response);
          if (daySchedule.length > 0) {
            console.log('Retrieved schedule for date: ' + daySchedule[0].Day);
            // Save each date in array so that they can be sorted 
            // after all dates are retrieved.
            mlbScheduleDates[mlbScheduleDates.length] = daySchedule;
          } else {
            console.log('Retrieved schedule for date: NO GAMES FOUND');
          }
          scheduleDaysCollected += 1;
          if (scheduleDaysCollected === 7) {

            var jsonfile = require('jsonfile');
            var file = 'data/mlb-schedule-new.json';
            jsonfile.writeFile(file, mlbScheduleDates, {spaces: 2}, function (err) {
              console.error(err);
            });
      
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
 * Load all MLB data and save off for off-season use.
 */
function loadData() {
  // Generate data to be used during the conversation.
  getMlbTeams()
    .then(function() {
      console.log('Retrieved MLB Teams');
      mlbTeamsRetrieved = true;
      exitWhenDone();
    })
    .catch(err => {
      throw new Error('Error loading MLB team info');
    });
  getMlbStandings()
    .then(function() {
      console.log('Retrieved MLB standings');
      mlbStandingsRetrieved = true;
      exitWhenDone();
    })
    .catch(err => {
      throw new Error('Error loading MLB standings');
    });
  getMlbSchedules()
    .then(function() {
      console.log('Retrieved MLB schedules');
      sortSchedule();
      mlbScheduleRetrieved = true;
      exitWhenDone();
    })
    .catch(err => {
      throw new Error('Error loading MLB schedules');
    });
}


/**
 * Exit after data is loaded.
 */
function exitWhenDone() {
  if (mlbTeamsRetrieved && mlbStandingsRetrieved && mlbScheduleRetrieved) {
    process.exit(0);    
  }  
}

// Start by loading MLB data
loadData();
