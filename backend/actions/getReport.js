var http = require('http');
var Xray = require('x-ray');
var THRESHOLD = 100;

function getReport(userLat, userLng) {
  return new Promise(function(resolve, reject) {
    var x = Xray();
    x('https://www.cfa.harvard.edu/skyreport',
      {
        eveningPlanets : ['.field.field-name-field-evening-planets.field-type-text-long.field-label-above li'],
        morningPlanets : ['.field.field-name-field-morning-planets-before-sun.field-type-text-long.field-label-above li'],
        comet          : '.field.field-name-field-comets.field-type-text-long.field-label-above p',
        meteor         : '.field.field-name-field-meteors.field-type-text-long.field-label-above p'
      }
    )(function(err, data) {
      if (err) {
        console.error('Error trying to scrape');
        throw err;
      } else {
        result = 'Here is your weekly report from the Harvard Smithsonian Center for Astrophysics: ';
        if (data.eveningPlanets && data.eveningPlanets.length) {
          var result = 'Planets visible in the evening: ';
          result += getPlanets(data.eveningPlanets);
        }
        if (data.morningPlanets && data.morningPlanets.length) {
          result += 'Planets visible in the early morning: ';
          result += getPlanets(data.morningPlanets);
        }
        if (data.comet && data.comet.length) {
          result += "There's a comet nearby: ";
          result += (data.comet);
        }
        if (data.meteor && data.meteor.length) {
          result += "There's a meteor nearby: ";
          result += (data.meteor);
        }
        resolve(result);
      }
    });
  });
}

module.exports = getReport;

/**
 * HELPERS
 */

var directionMap = {
  N: 'North',
  S: 'South',
  E: 'East',
  W: 'West'
};

function getPlanets(planets) {
  return planets.map(function(p) {
    var parts = p.split(', ');
    var directions = parts[1].split('').map(function(d) {
      return directionMap[d];
    }).join(' ');
    return parts[0] + ' in the ' + directions + '. ';
  }).join('');
}