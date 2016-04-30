var http = require('http');
var Xray = require('x-ray');
var THRESHOLD = 100;

function getReport() {
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
      	// temp excellent error handling skillz
      	resolve('');
      } else {
        result = {
          planets: 'In the evening: ' + getPlanets(data.eveningPlanets) + '\n\nIn the early morning: ' + getPlanets(data.morningPlanets),
          comets: data.comet,
          meteor: data.meteor
        };
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