var http = require('http');

/* Alexa */
var APP_ID = 'amzn1.echo-sdk-ams.app.d7e49c7e-64db-4d63-b758-f2ccc587eed9';
var AlexaSkill = require('./AlexaSkill');

var WhatsOutsideSkill = function() {
	AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
WhatsOutsideSkill.prototype = Object.create(AlexaSkill.prototype);
WhatsOutsideSkill.prototype.constructor = WhatsOutsideSkill;
WhatsOutsideSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
	console.log("WhatsOutsideSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
			+ ", sessionId: " + session.sessionId);

	// any session init logic would go here
};
WhatsOutsideSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
	console.log("WhatsOutsideSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
	getWelcomeResponse(response);
};
WhatsOutsideSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
	console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
			+ ", sessionId: " + session.sessionId);
	// any session cleanup logic would go here
};

function handleWhatsOutsideIntent(intent, session, response) {
	var errorResponse = 'There was a problem getting your location, try again with a different city';
	var citySlot = intent.slots.city;
	var city = 'New+York';
	if (citySlot && citySlot.value) {
		city = citySlot.value.split(' ').join('+');
	}

	var lat, lng;

	http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + city + '&components=country:USA', function (res, err) {
		if (err) {
			response.ask(errorResponse);
		}

		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var locations = JSON.parse(body).results;
			if (locations && locations.length) {
				lat = locations[0].geometry.location.lat;
				lng = locations[0].geometry.location.lng;

				// lat lng reversed. Why? No idea

				http.get('http://whatsoutsidetonightapi.azurewebsites.net?lng=' + lat + '&lat=' + lng, function (res2, err2) {
					if (err2) {
						response.ask('There was a problem getting the star gazer report. Please try again.');
					}
					var starGazerBody = '';
					res2.on('data', function(chunk) {
						starGazerBody += chunk;
					});
					res2.on('end', function() {
						var starGazerResponse = JSON.parse(starGazerBody);
						var cleanResponse = cleanupResponse(starGazerResponse);
						response.tell(cleanResponse);
					})
				});

			} else {
				response.ask(errorResponse);
			}
		});
	});
}

WhatsOutsideSkill.prototype.intentHandlers = {
		"GetWhatsTonightIntent": function (intent, session, response) {
				handleWhatsOutsideIntent(intent, session, response);
		},

		"AMAZON.HelpIntent": function (intent, session, response) {
			var speechText = "I can tell you tonight's star gazer report for your city, just say, what's outside tonight near, followed by a major US city.";

			var speechOutput = {
					speech: speechText,
					type: AlexaSkill.speechOutputType.PLAIN_TEXT
			};
			var repromptOutput = {
					speech: speechText,
					type: AlexaSkill.speechOutputType.PLAIN_TEXT
			};
			// For the repromptText, play the speechOutput again
			response.ask(speechOutput, repromptOutput);
		}
};

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	var skill = new WhatsOutsideSkill();
	skill.execute(event, context);
};

/* End Alexa */

/**
 * HELPERS
 */

function cleanupResponse(data) {
	console.log(data);
  return Object.keys(data).map(function(k) {
  	var cleanKey = k.replace(k[0], k[0].toUpperCase()) + ' report: ';
  	if (k === 'cfa') {
  		cleanKey = 'More information from the Harvard Smithsonian Center For Astrophysics: ';
  	}
  	return cleanKey + data[k];
  }).join('\n\n');
}