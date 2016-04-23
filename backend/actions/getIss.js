var http = require('http');

var THRESHOLD = 100;

function getIss(userLat, userLng) {
  return new Promise(function(resolve, reject) {
    http.get('http://api.open-notify.org/iss-now.json', function (res, err) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        var position = JSON.parse(body).iss_position;
        var issLat = position.latitude;
        var issLng = position.longitude;

        var distance = Math.round(getDistanceFromLatLonInKm(issLat, issLng, userLat, userLng));

        var prefix = "The International Space Station is " + distance + " kilometers from your current location.";
        var suffix = "Unfortunately, you're probably not going to have much luck tonight";
        if (distance <= THRESHOLD) {
          suffix = "You're in luck! Go outside and check out it out";
        }

        resolve(prefix + ' ' + suffix);
      });
    });
  })
}

module.exports = getIss;

/**
 * HELPERS
 */

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}


