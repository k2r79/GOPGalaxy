var Game = require('../entities/game');
var Planet = require('../entities/planet');
var Fleet = require('../entities/fleet');

module.exports.parseBody = function(body) {
    var planets = body.planets.map(function(planet) {
        return new Planet(planet.id, planet.x, planet.y, planet.owner, planet.units, planet.mu, planet.gr, planet.classe, planet.tr);
    });

    var fleets = body.fleets.map(function(fleet) {
        return new Fleet(fleet.owner, fleet.units, fleet.from, fleet.to, fleet.turns, fleet.left);
    });

    var config = body.config;

    return new Game(config.id, config.turn, config.maxTurn, planets, fleets);
};
