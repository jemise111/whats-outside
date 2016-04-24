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

function getStarGazer() {
  var lat = -74.010074;
  var lng = 40.709160;
  var userLocale = 'newyork,ny'

  return Promise.all([
    getWeather(lat, lng),
    getMoonPhase(userLocale),
    getReport(lat, lng),
    getIss(lat, lng),
    getAsteroids(),
  ])
}

/* one route to rule them all (dev)*/
app.get('/', function(req, res) {
  res.header("Content-Type",'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  // ASSUME WE GET LAT LNG INFORMATION FROM FRONTEND

  getStarGazer()
  .then(function(values) {
    var cleanValues = cleanupValues(values);
    res.json(cleanValues);
  })
  .catch(function(error){
    res.json({error: 'Something went wrong'});
  })

});

app.get('/twilio', function(req, res) {
  res.header("Content-Type",'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  // ASSUME WE GET LAT LNG INFORMATION FROM FRONTEND

  getStarGazer()
  .then(function(values) {
    var accountSid = 'ACb7d3fdeeb8a9d31d5f22e20399859769'; 
    var authToken = '2fac396d9ccf479906b9b5af35bcb84e'; 
     
    //require the Twilio module and create a REST client 
    var client = require('twilio')(accountSid, authToken); 
     
    client.messages.create({
      to: "5163300941", 
      from: "+13478616881", 
      body: cleanupValuesTwilio(values)
    }, function(err, message) {
        if (err) {
          console.log(err);
          res.send('there was a problem');
        } else {
          res.send('okay');
        }
    });     
  })
  .catch(function(error){
    console.log("SOMETHING WENT WRONG", error);
  })

});

app.listen(process.env.PORT || 8080, function() {
  console.log('server started');
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

function cleanupValuesTwilio(values) {
  var result = cleanupValues(values);

  return result.map(function(obj) {
    var key = Object.keys(obj)[0];
    return key + ' report: ' + obj[key];
  }).join('\n\n');
}