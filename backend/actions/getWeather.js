var http = require('http');

function getWeather(userLng, userLat) {
  var appID = 'b150ee20258033d5838a4f945a306666';
  var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + userLat + "&lon=" + userLng + "&appid=" + appID;

  return new Promise(function(resolve, reject) {
    http.get(url, function(res, err){
      var body = '';
      res.on('data', function(chunk){
        body += chunk;
      });
      res.on('end', function() {
        var response = JSON.parse(body);

        // things to give Alexa
        var cityName = response.name;
        var weather = response.weather[0].description;
        var cloudsPercentage = response.clouds.all;
        var min_temp_kelvin = response.main.temp_min;
        var min_temp = (min_temp_kelvin - 273.15)* 1.8000 + 32.00;
        min_temp = Math.round(min_temp);

        // convert from unix to human time
        var sunset = new Date(response.sys.sunset *1000);
        var hours = sunset.getHours();
        var minutes = sunset.getMinutes();
        // change from army time
        if (hours > 12) {
          hours -= 12
        }
        // if mins are below 10 time looks like 7:2pm
        if (minutes < 10) {
          minutes = "0" + sunset.getMinutes();
        }
        // err: eval to 4 hours after?
        sunset = hours + ':' + minutes;

        resolve('The weather for tonight in ' + cityName + ' is ' + weather + ' with a low of ' + min_temp + ' degrees and ' + cloudsPercentage + ' percent cloud coverege. The sun will set at 7:45 p.m.');
      });
    }); // end get
  }) // end promise

} // end getWeather

module.exports = getWeather;
