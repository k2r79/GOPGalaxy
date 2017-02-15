var FuturFleet = require('../entities/futur-fleet');

module.exports.computeNextRound = function(game) {
    var futurFleet = new FuturFleet(3, game.planets.find(function(planet) { return planet.owner == 1 }).id, game.planets.find(function(planet) { return planet.owner == 0 }).id);
    game.futurFleets.push(futurFleet);
};
