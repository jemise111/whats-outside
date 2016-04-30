var http = require('http');

function getMoonPhase(){

	var today = new Date();
	var formattedDate = (today.getMonth() + 1) + '/' + today.getDate() + today.getFullYear();

	

	var url = 'http://api.usno.navy.mil/moon/phase?nump=1&date=' + formattedDate;

	return new Promise(function(resolve, reject){
		http.get(url, function(res, err){
		    if (err) {
      	      // temp excellent error handling skillz
      	      resolve('');
            }
            
			var body = '';
			res.on('data', function(chunk){
				body += chunk;
			}); // end on data
			res.on('end', function() {
				var response = JSON.parse(body);
				console.log(response);
				var moonPhase = response.phasedata[0].phase.toLowerCase();
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
