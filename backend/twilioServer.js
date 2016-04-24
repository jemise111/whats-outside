var schedule = require('node-schedule');

var getIss = require('./actions/getIss');
var getAsteroids = require('./actions/getAsteroids');
var getReport = require('./actions/getReport');
var getWeather = require('./actions/getWeather');

// ASSUME WE GET LAT LNG INFORMATION FROM FRONTEND

var lat = -74.010074;
var lng = 40.709160;

var rule = new schedule.RecurrenceRule();
rule.minute = 1;

schedule.scheduleJob(rule, function(){
  Promise.all([
    getIss(lat, lng),
    getAsteroids(lat, lng),
    getReport(),
    // getWeather(lat, lng)
  ])
  .then(function(values) {
    // Twilio Credentials 
    var accountSid = 'ACb7d3fdeeb8a9d31d5f22e20399859769'; 
    var authToken = '2fac396d9ccf479906b9b5af35bcb84e'; 
     
    //require the Twilio module and create a REST client 
    var client = require('twilio')(accountSid, authToken); 
     
    client.messages.create({ 
      to: "5163300941", 
      from: "+13478616881", 
      body: values.join('\n'),
    }, function(err, message) { 
      console.log(err, message);
      console.log(message.sid); 
    });
  })
  .catch(function(error){
    console.log("SOMETHING WENT WRONG", error);
  })
});