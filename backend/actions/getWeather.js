var http = require('http');

function getWeather(userLat, userLng) {
  var appID = 'b150ee20258033d5838a4f945a306666';
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + userLat + "&lon=" + userLng + "&appid=" + appID;
  console.log(url);
  console.log('===');

  return new Promise(function() {
    http.get(url, function(res, err){
      var body = '';
      res.on('data', function(chunk){
        body += chunk;
      });
      res.on('end', function() {
        console.log(JSON.parse(body));
      });

    });
  }) // end promise
} // end getWeather

module.exports = getWeather;
