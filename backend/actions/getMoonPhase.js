var http = require('http');

function getMoonPhase(userLocale){

  var client_id = '&client_id=b9sNvkAbTuLNbbSIWPLt5';
  var client_secret = '&client_secret=CQJheqVVJJ5TWc6OU86Wk9t1EzF76svJcfJ7p0wa';
  var url = 'http://api.aerisapi.com/sunmoon/moonphases/' + userLocale + '?limit=1' + client_id + client_secret;

  return new Promise(function(resolve, reject){
    http.get(url, function(res, err){
      var body = '';
      res.on('data', function(chunk){
        body += chunk;
      }); // end on data
      res.on('end', function() {
        var response = JSON.parse(body);
        var moonPhase = response.response[0].name;
        switch (moonPhase) {
          case 'first quarter':
            moonPhase = 'The moon is half illuminated tonight.'
            break;
          case 'last quarter':
            moonPhase = 'The moon is half illuminated tonight.'
            break;
          case 'new moon':
            moonPhase = 'The moon is invisible tonight.'
          case 'full moon':
            moonPhase = 'The moon is full tonight.'
        }

        resolve(moonPhase);

      }); // end on end
    }); // end get
  }) // end promise
}

module.exports = getMoonPhase;
