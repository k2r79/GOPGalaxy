var Opportunity = require('./classes/opportunity');
var FuturFleet = require('../entities/futur-fleet');

var minUnits = 20;
var unitOffset = 1;
var fleetSize = 3;

module.exports.computeNextRound = function(game) {
    game.ownedPlanets()
        .forEach(function(sourcePlanet) {
            game.planets
                .filter(planet => planet.id != sourcePlanet.id)
                .map(planet => new Opportunity(sourcePlanet, planet, computeNeededUnits(sourcePlanet, planet, game)))
                .sort((o1, o2) => o2.getInterest() - o1.getInterest())
                .forEach(function(opportunity) {
                    console.log(opportunity.neededUnits + "," + opportunity.distance + "," + opportunity.destinationPlanet.growthRate + "," + opportunity.destinationPlanet.owner + "," + opportunity.interest);

                    var availableUnits = opportunity.sourcePlanet.units - minUnits;
                    var unitsToSend = opportunity.neededUnits;
                    if (opportunity.neededUnits > availableUnits) {
                        unitsToSend = availableUnits;
                    }

                    if (unitsToSend >= fleetSize && opportunity.destinationPlanet.owner != 1 && opportunity.destinationPlanet.terraforming == null) {
                        opportunity.sourcePlanet.units -= unitsToSend;

                        var futurFleet = new FuturFleet(unitsToSend, opportunity.sourcePlanet, opportunity.destinationPlanet);
                        game.futurFleets.push(futurFleet);
                    }
                    // else if (opportunity.sourcePlanet.units - fleetSize >= minUnits) {
                    //     opportunity.sourcePlanet.units -= fleetSize;
                    //
                    //     var futurFleet = new FuturFleet(fleetSize, opportunity.sourcePlanet, opportunity.destinationPlanet);
                    //     game.futurFleets.push(futurFleet);
                    // }
                });
        });

    // game.ownedPlanets()
    //     .filter(planet => ['H', 'K', 'L'].includes(planet.type))
    //     .forEach(function(planet) {
    //         if (!planet.terraforming && planet.growthRate < 3 && (game.maxTurns - game.turn > planet.growthRate * 2 + 20)) {
    //             game.terraformings.push(planet);
    //         }
    //     });
};

function computeNeededUnits(sourcePlanet, planet, game) {
    var timeToPlanet = sourcePlanet.timeTo(planet.x, planet.y);

    var fleetUnits = game.fleetsTo(planet.id)
        .filter(fleet => fleet.roundsLeft <= timeToPlanet)
        .reduce(function(i, fleet) {
            if (fleet.owner == planet.owner) {
                return i + fleet.units;
            } else {
                return i - fleet.units;
            }
        }, 0);

    var futurFleetUnits = game.futurFleetsTo(planet.id)
        .filter(futurFleet => futurFleet.roundsLeft <= timeToPlanet)
        .reduce(function(i, fleet) {
            if (fleet.owner == 1) {
                return i + fleet.units;
            } else {
                return i - fleet.units;
            }
        }, 0);

    futurFleetUnits += game.futurFleetsFrom(planet.id)
        .reduce((i, fleet) => i - fleet.units, 0);

    var growth = planet.owner != 0 ? planet.growthRate * timeToPlanet : 0

    return planet.units + growth + fleetUnits + futurFleetUnits + planet.growthRate + unitOffset;
}
