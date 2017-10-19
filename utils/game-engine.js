var Opportunity = require('./classes/opportunity');
var FuturFleet = require('../entities/futur-fleet');

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
            do {
                var opportunity = game.planets.map(planet => new Opportunity(sourcePlanet, planet, computeNeededUnits(sourcePlanet.timeTo(planet.x, planet.y), planet, game)))
                    .sort((o1, o2) => o2.getInterest() - o1.getInterest())
                    .pop()

                var survivalUnits = computeSurvivalUnits(opportunity.sourcePlanet, game);
                var availableUnits = opportunity.sourcePlanet.units - survivalUnits;
                var unitsToSend = opportunity.neededUnits;

                // console.log("Survival : " + survivalUnits + " | Available : " + availableUnits + " | Needed : " + unitsToSend);
                if (opportunity.neededUnits > availableUnits) {
                    unitsToSend = availableUnits;
                }

                if (unitsToSend < fleetSize && availableUnits > fleetSize) {
                    unitsToSend = fleetSize;
                }

                //if (unitsToSend >= fleetSize && !game.isTerraforming(opportunity.sourcePlanet)) {
                    sendUnits(unitsToSend, opportunity, game);
                    sourcePlanet.units -= unitsToSend;
                //}
            } while (availableUnits > 0);
        });
};

function computeNeededUnits(timeToPlanet, planet, game) {
    // var fleetUnits = game.fleetsTo(planet.id)
    //     .filter(fleet => fleet.roundsLeft <= timeToPlanet)
    //     .reduce(function(i, fleet) {
    //         if (planet.owner == 1) {
    //             if (fleet.owner == 1) {
    //                 return i - fleet.units;
    //             } else {
    //                 return i + fleet.units;
    //             }
    //         } else {
    //             if (fleet.owner == planet.owner) {
    //                 return i + fleet.units;
    //             } else {
    //                 return i - fleet.units;
    //             }
    //         }
    //     }, 0);
    //
    // var futurFleetUnits = game.futurFleetsTo(planet.id)
    //     .reduce(function(i, fleet) {
    //         if (planet.owner == 1) {
    //             return i - fleet.units;
    //         } else {
    //             return i + fleet.units;
    //         }
    //     }, 0);

    var currentOwner = planet.owner;
    var planetLife = planet.units;
    for (round = 0; round <= timeToPlanet; round++) {
        if (!planet.terraforming && currentOwner != 0) {
            planetLife += planet.growthRate
        }

        var futureFleets = game.futurFleetsTo(planet.id)
            .map(function(futureFleet) {
                return { owner: 1, units: futureFleet.units, roundsLeft: futureFleet.duration };
            });

        var fleets = game.fleetsTo(planet.id)
            .map(function(fleet) {
                return { owner: fleet.owner, units: fleet.units, roundsLeft: fleet.roundsLeft};
            })
            .concat(futureFleets)
            .filter(fleet => fleet.roundsLeft == round);

        if (fleets.length > 0) {
            var ownerFleets = [ 0, 0, 0, 0, 0 ];
            for (fleetIndex = 0; fleetIndex < fleets.length; fleetIndex++) {
                var fleet = fleets[fleetIndex];
                ownerFleets[fleet.owner] += fleet.units;
            }

            var strongestFleet = { owner: 0, units: 0};
            var leftoverUnits = 0;
            for (owner = 0; owner < ownerFleets.length; owner++) {
                leftoverUnits = Math.abs(leftoverUnits - ownerFleets[owner]);
                if (ownerFleets[owner] > strongestFleet.units) {
                    strongestFleet = { owner: owner, units: ownerFleets[owner] };
                }
            }

            if (strongestFleet.owner != currentOwner && planetLife < 0) {
                currentOwner = strongestFleet.owner;
                planetLife = Math.abs(planetLife);
            }
        }
    }

    return currentOwner == 1 ? -(planetLife + unitOffset) : planetLife + unitOffset;

    // var growth = 0
    // if (planet.owner != 0) {
    //     growth = planet.growthRate * timeToPlanet
    // } else if (planet.owner == 1) {
    //     growth = -planet.growthRate * timeToPlanet;
    // }

    // return planet.units + growth + fleetUnits + futurFleetUnits + unitOffset;
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

    return 1 + fleetUnits - growth;
}

function sendUnits(units, opportunity, game) {
    opportunity.sourcePlanet.units -= units;

    var futurFleet = new FuturFleet(units, opportunity.sourcePlanet, opportunity.destinationPlanet);
    game.futurFleets.push(futurFleet);
}
