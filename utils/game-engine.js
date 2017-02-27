var Graph = require('./classes/graph').Graph;
var Edge = require('./classes/graph').Edge;
var Opportunity = require('./classes/opportunity');
var FuturFleet = require('../entities/futur-fleet');

module.exports = class GameEngine {
    constructor(game) {
        this.graph = this.buildGraph(game.planets);
        this.unitOffset = 1;
        this.fleetSize = 3;
    }

    computeNextRound(game) {
        var self = this;

        game.ownedPlanets()
            .filter(planet => planet.terraformable())
            .forEach(function(planet) {
                if (planet.growthRate < 3 && (game.maxTurns - game.turn > planet.growthRate * 2 + 20)) {
                    console.log("terraforming planet " + planet.id)
                    game.terraformings.push({ planet: planet.id });
                }
            });

        var maxSupportPlanets = Math.floor(game.ownedPlanets().length / 2);
        game.ownedPlanets()
            .forEach(function(sourcePlanet) {
                game.planets
                    .filter(planet => planet.id != sourcePlanet.id)
                    .map(planet => new Opportunity(sourcePlanet, planet, self.computeNeededUnits(sourcePlanet.timeTo(planet.x, planet.y), planet, game), game.turn))
                    .sort((o1, o2) => o2.getInterest() - o1.getInterest())
                    .forEach(function(opportunity) {
                        // console.log(opportunity.neededUnits + "," + opportunity.distance + "," + opportunity.destinationPlanet.growthRate + "," + opportunity.destinationPlanet.owner + "," + opportunity.interest);

                        var survivalUnits = self.computeSurvivalUnits(opportunity.sourcePlanet, game);
                        var availableUnits = opportunity.sourcePlanet.units - survivalUnits;
                        var unitsToSend = opportunity.neededUnits;

                        // console.log("Survival : " + survivalUnits + " | Available : " + availableUnits + " | Needed : " + unitsToSend);
                        if (opportunity.neededUnits > availableUnits) {
                            unitsToSend = availableUnits;
                        }

                        if (unitsToSend < fleetSize && availableUnits > fleetSize) {
                            unitsToSend = fleetSize;
                        }

                        if (unitsToSend >= fleetSize && !game.isTerraforming(opportunity.sourcePlanet) && (!opportunity.isSupportFleet() || (opportunity.isSupportFleet() && game.supportPlanets().length <= maxSupportPlanets))) {
                            this.sendUnits(unitsToSend, opportunity, game);
                        }
                    });
            });
    }

    buildGraph(planets) {
        var processedPlanets = [];
        var edges = planets.map(planet => {
                var e = planets.filter(p => p.id != planet.id)
                    .map(p => {
                        if (processedPlanets.includes(p.id)) {
                            return undefined;
                        }

                        return new Edge([ planet.id, p.id ], planet.distanceFrom(p.x, p.y));
                    }).filter(e => e);

                processedPlanets.push(planet.id);

                return e;
            })
            .reduce((x, y) => x.concat(y), []);

        return new Graph(edges);
    }

    kruskalThisShitMan() {
        var lightestVertice = this.graph.vertices
            .sort((v1, v2) => v2.weight - v1.weight)[0];


    }

    computeNeededUnits(timeToPlanet, planet, game) {
        var fleetUnits = game.fleetsTo(planet.id)
            .filter(fleet => fleet.roundsLeft <= timeToPlanet)
            .reduce(function(i, fleet) {
                if (planet.owner == 1) {
                    if (fleet.owner == 1) {
                        return i - fleet.units;
                    } else {
                        return i + fleet.units;
                    }
                } else {
                    if (fleet.owner == planet.owner) {
                        return i + fleet.units;
                    } else {
                        return i - fleet.units;
                    }
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

        // futurFleetUnits += game.futurFleetsFrom(planet.id)
        //     .reduce((i, fleet) => i - fleet.units, 0);

        var growth = planet.owner != 0 ? planet.growthRate * timeToPlanet : 0

        return planet.units + growth + fleetUnits + futurFleetUnits + unitOffset;
    }

    computeSurvivalUnits(planet, game) {
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

    sendUnits(units, opportunity, game) {
        opportunity.sourcePlanet.units -= units;

        var futurFleet = new FuturFleet(units, opportunity.sourcePlanet, opportunity.destinationPlanet);
        game.futurFleets.push(futurFleet);
    }
};
