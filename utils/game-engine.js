var FuturFleet = require('../entities/futur-fleet');

var minUnits = 10;

class Opportunity {

    constructor(interest, sourcePlanet, destinationPlanet, units) {
        this.interest = interest;
        this.sourcePlanet = sourcePlanet;
        this.destinationPlanet = destinationPlanet;
        this.units = units;
    }
}

module.exports.computeNextRound = function(game) {
    var distances = game.planets.filter(function(planet) {
        return planet.owner == 1;
    }).map(function(planet) {
        return computeDistance(planet, game.planets);
    }).forEach(function(distance) {
        var neededUnits = distance.destinationPlanet.units + 1;
        if ((distance.sourcePlanet.units -= neededUnits) > minUnits) {
            var futurFleet = new FuturFleet(neededUnits, distance.sourcePlanet.id, distance.destinationPlanet.id);
            game.futurFleets.push(futurFleet);
        }
    });
};

function computeDistance(sourcePlanet, planets) {
    return planets.filter(function(planet) {
            return planet.owner == 0;
        }).map(function(planet) {
            var xDistance = planet.x - sourcePlanet.x;
            var yDistance = planet.y - sourcePlanet.y;
            var distance = xDistance * xDistance + yDistance * yDistance

            return {
                sourcePlanet: sourcePlanet,
                destinationPlanet: planet,
                distance: Math.sqrt(distance)
            };
        }).sort(function(distance1, distance2) {
            return distance1.distance - distance2.distance;
        })[0];
}
