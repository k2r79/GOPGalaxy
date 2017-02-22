var Opportunity = require('./classes/opportunity');
var FuturFleet = require('../entities/futur-fleet');

var minUnits = 1;
var unitOffset = 1;
var fleetSize = 3;

module.exports.computeNextRound = function(game) {

    game.ownedPlanets()
        .filter(planet => planet.terraformable())
        .forEach(function(planet) {
            if (planet.growthRate < 3 && (game.maxTurns - game.turn > planet.growthRate * 2 + 20)) {
                console.log("terraforming planet " + planet.id)
                game.terraformings.push({ planet: planet.id });
            }
        });

    game.ownedPlanets()
        .forEach(function(sourcePlanet) {
            game.planets
                .filter(planet => planet.id != sourcePlanet.id)
                .map(planet => new Opportunity(sourcePlanet, planet, computeNeededUnits(sourcePlanet.timeTo(planet.x, planet.y), planet, game)))
                .sort((o1, o2) => o2.getInterest() - o1.getInterest())
                .forEach(function(opportunity) {
                    // console.log(opportunity.neededUnits + "," + opportunity.distance + "," + opportunity.destinationPlanet.growthRate + "," + opportunity.destinationPlanet.owner + "," + opportunity.interest);

                    var survivalUnits = computeSurvivalUnits(opportunity.sourcePlanet, game);
                    var availableUnits = opportunity.sourcePlanet.units - survivalUnits - minUnits;
                    var unitsToSend = opportunity.neededUnits;

                    // console.log("Survival : " + survivalUnits + " | Available : " + availableUnits + " | Needed : " + unitsToSend);
                    if (opportunity.neededUnits > availableUnits) {
                        unitsToSend = availableUnits;
                    }

                    if (unitsToSend >= fleetSize && !game.isTerraforming(opportunity.sourcePlanet)) {
                        opportunity.sourcePlanet.units -= unitsToSend;

                        var futurFleet = new FuturFleet(unitsToSend, opportunity.sourcePlanet, opportunity.destinationPlanet);
                        game.futurFleets.push(futurFleet);
                    }
                });
        });
};

function computeNeededUnits(timeToPlanet, planet, game) {
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
        .reduce(function(i, fleet) {
            if (planet.owner == 1) {
                return i - fleet.units;
            } else {
                return i + fleet.units;
            }
        }, 0);

    futurFleetUnits += game.futurFleetsFrom(planet.id)
        .reduce((i, fleet) => i - fleet.units, 0);

    var growth = planet.owner != 0 ? planet.growthRate * timeToPlanet : 0

    return planet.units + growth + fleetUnits + futurFleetUnits + unitOffset;
}

function computeSurvivalUnits(planet, game) {
    var fleetUnits = game.fleetsTo(planet.id)
        .filter(fleet => fleet.owner != 1)
        .reduce(function(i, fleet) {
            return i + fleet.units;
        }, 0);

    var growth = 0;
    if (planet.terraforming == null) {
        var growth = planet.growthRate
    }

    return fleetUnits - growth;
}
