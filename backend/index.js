var getIss = require('./actions/getIss');
var getAsteroids = require('./actions/getAsteroids');
var getWeather = require('./actions/getWeather');
var getMoonPhase = require('./actions/getMoonPhase');
var getReport = require('./actions/getReport');

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

function getStarGazer() {
  var lat = -74.010074;
  var lng = 40.709160;
  var userLocale = 'newyork,ny'

  return Promise.all([
    getWeather(lat, lng),
    getMoonPhase(userLocale),
    getReport(lat, lng),
    getIss(lat, lng),
    getAsteroids()
  ])
}

function getWelcomeResponse(response) {

  getStarGazer()
  .then(function(values) {
    var cleanValues = cleanupValues(values);
    // response.tell('Hello Liza');
    response.tell(cleanValues);
  })
  .catch(function(error){
    response.tell('Something went wrong with the promise');
  })
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
  // Create an instance of the HistoryBuff Skill.
  var skill = new WhatsOutsideSkill();
  skill.execute(event, context);
};

/* End Alexa */

/**
 * HELPERS
 */

function cleanupValues(values) {
  var result = [];
  var weather = values[0];
  result.push({Weather: weather});

  var moon = values[1];
  result.push({Moon: moon});

  var report = values[2];
  result.push({Planet: report.planets});

  var iss = values[3];
  result.push({ISS: iss});

  var asteroids = values[4];
  result.push({Asteroid: asteroids});
  
  result.push({Bonus: report.comets + '\n\n' + report.meteor});

  return result.map(function(obj) {
    var key = Object.keys(obj)[0];
    return key + ' report: ' + obj[key];
  }).join('\n\n');
}