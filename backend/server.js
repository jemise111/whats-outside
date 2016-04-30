var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var https = require('https');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser')

var app = express();
app.use( bodyParser.json() ); 

var getIss = require('./actions/getIss');
var getAsteroids = require('./actions/getAsteroids');
var getWeather = require('./actions/getWeather');
var getMoonPhase = require('./actions/getMoonPhase');
var getReport = require('./actions/getReport');

function getStarGazer(lat, lng) {
  // Default to NYC
  lat = lat || -74.010074;
  lng = lng || 40.709160;

  return Promise.all([
    getWeather(lat, lng),
    getMoonPhase(),
    getReport(lat, lng),
    getIss(lat, lng),
    getAsteroids()
  ])
}

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/* one route to rule them all (dev)*/
app.get('/', function(req, res) {
  res.header("Content-Type",'application/json');
  res.header('Access-Control-Allow-Origin', '*');
  // ASSUME WE GET LAT LNG INFORMATION FROM FRONTEND

  getStarGazer(req.query.lat, req.query.lng)
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

app.post('/enternumber', function(req, res) {
  res.header("Content-Type",'application/json');
  res.header('Access-Control-Allow-Origin', '*');

  var phone = req.body.phone;

  var accountSid = 'ACb7d3fdeeb8a9d31d5f22e20399859769'; 
  var authToken = '2fac396d9ccf479906b9b5af35bcb84e'; 
   
  //require the Twilio module and create a REST client 
  var client = require('twilio')(accountSid, authToken); 
   
  client.messages.create({
    to: "5163300941", 
    from: "+13478616881", 
    body: phone + ' wants daily reports'
  }, function(err, message) {
      if (err) {
        console.log(err);
        res.send({msg: 'problem'});
      } else {
        res.send({msg: 'success'});
      }
  });

});

app.listen(process.env.PORT || 8082, function() {
  console.log('server started');
});

/**
 * HELPERS
 */

function cleanupValues(values) {
  return {
  	weather: values[0],
  	moon: values[1],
  	planet: values[2].planets,
  	iss: values[3],
  	asteroid: values[4],
  	cfa: values[2].comets + '\n\n' + values[2].meteor
  };
}

function cleanupValuesTwilio(values) {
  var data = cleanupValues(values);
  return Object.keys(data).map(function(k) {
  	var cleanKey = k.replace(k[0], k[0].toUpperCase());
  	return cleanKey + ' report: ' + data[k];
  }).join('\n\n');
}