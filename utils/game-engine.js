var Opportunity = require('../entities/opportunity');
var FuturFleet = require('../entities/futur-fleet');

var minUnits = 10;
var unitOffset = 1;
var fleetSize = 3;

module.exports.computeNextRound = function(game) {
    game.ownedPlanets()
        .forEach(function(sourcePlanet) {
            game.planets
                .filter(planet => planet.id != sourcePlanet.id)
                .map(planet => new Opportunity(sourcePlanet, planet))
                .sort((o1, o2) => o2.getInterest() - o1.getInterest())
                .forEach(function(opportunity) {
                    var neededUnits = computeNeededUnits(opportunity.destinationPlanet);

                    if (opportunity.destinationPlanet.owner == 0 && (opportunity.sourcePlanet.units - neededUnits >= minUnits)) {
                        opportunity.sourcePlanet.units -= neededUnits;

                        var futurFleet = new FuturFleet(neededUnits, opportunity.sourcePlanet.id, opportunity.destinationPlanet.id);
                        game.futurFleets.push(futurFleet);
                    } else if (opportunity.sourcePlanet.units - fleetSize >= minUnits) {
                        opportunity.sourcePlanet.units -= fleetSize;

                        var futurFleet = new FuturFleet(fleetSize, opportunity.sourcePlanet.id, opportunity.destinationPlanet.id);
                        game.futurFleets.push(futurFleet);
                    }
                });
        });
};

function computeNeededUnits(planet) {
    var neededUnits = planet.units + unitOffset;

    return neededUnits >= 3 ? neededUnits : 3;
}
