var http = require('http');

function getIss() {
  return new Promise(function(resolve, reject) {
    http.get('http://api.open-notify.org/iss-now.json', function (res, err) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
        resolve(JSON.parse(body));
      });
    });
  })
}

module.exports = getIss;


