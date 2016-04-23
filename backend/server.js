var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

var getIss = require('./actions/getIss');
var getAsteroids = require('./actions/getAsteroids');
// var getWeather = require('./actions/getIss');
// var getMoonPhase = require('./actions/getIss');
// var getPlanets = require('./actions/getIss');

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.header("Content-Type",'application/json');

  // ASSUME WE GET LAT LNG INFORMATION FROM FRONTEND

  var lat = -74.010074;
  var lng = 40.709160;

  Promise.all([
    getIss(lat, lng),
    getAsteroids(lat, lng),
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