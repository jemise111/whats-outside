var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var https = require('https');

var app = express();

var getIss = require('./actions/getIss');
var getAsteroids = require('./actions/getAsteroids');
var getWeather = require('./actions/getWeather');
var getMoonPhase = require('./actions/getMoonPhase');
// var getMoonPhase = require('./actions/getIss');
// var getPlanets = require('./actions/getIss');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

/* Alexa */
var APP_ID = 'amzn1.echo-sdk-ams.app.d7e49c7e-64db-4d63-b758-f2ccc587eed9';
var AlexaSkill = require('./AlexaSkill');

var WhatsOutsideSkill = function() {
  AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
WhatsOutsideSkill.prototype = Object.create(AlexaSkill.prototype);
WhatsOutsideSkill.prototype.constructor = WhatsOutsideSkill;
WhatsOutsideSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
  console.log("WhatsOutsideSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
      + ", sessionId: " + session.sessionId);

  // any session init logic would go here
};
WhatsOutsideSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
  console.log("WhatsOutsideSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
  getWelcomeResponse(response);
};
WhatsOutsideSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
  console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
      + ", sessionId: " + session.sessionId);
  // any session cleanup logic would go here
};
function getWelcomeResponse(response) {
  var lat = -74.010074;
  var lng = 40.709160;
  var userLocale = 'newyork,ny'
  Promise.all([
    getMoonPhase(userLocale),
    getWeather(lat, lng),
    getIss(lat, lng)
    // getAsteroids(lat, lng),
  ])
  .then(function(values) {
    response.tell(values.join('\n'));
  })
  .catch(function(error){
    response.tell('Something went wrong with the promise');
  })
  // response.tell('Hello Liza');
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  // Create an instance of the HistoryBuff Skill.
  var skill = new WhatsOutsideSkill();
  skill.execute(event, context);
};

/* End Alexa */

/* one route to rule them all (dev)*/
app.get('/', function(req, res) {
  res.header("Content-Type",'application/json');

  // ASSUME WE GET LAT LNG INFORMATION FROM FRONTEND

  var lat = -74.010074;
  var lng = 40.709160;
  var userLocale = 'newyork,ny'

  Promise.all([
    getWeather(lat, lng),
    getMoonPhase(userLocale),
    getIss(lat, lng)
  ])
  .then(function(values) {
    res.json(values);
  })
  .catch(function(error){
    console.log("SOMETHING WENT WRONG", error);
  })

});

app.listen(3000, function() {
  console.log('server started on port 3000');
});
