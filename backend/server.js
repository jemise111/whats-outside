var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var https = require('https');

var app = express();

var getIss = require('./actions/getIss');
var getAsteroids = require('./actions/getAsteroids');
var getWeather = require('./actions/getWeather');
var getMoonPhase = require('./actions/getMoonPhase');
var getReport = require('./actions/getReport');

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
    getReport(lat, lng),
    getIss(lat, lng),
    getAsteroids(),
  ])
  .then(function(values) {
    var cleanValues = cleanupValues(values);
    res.json(cleanValues);
  })
  .catch(function(error){
    res.json({error: 'Something went wrong'});
  })

});

app.listen(3000, function() {
  console.log('server started on port 3000');
});

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

  return result;
}
