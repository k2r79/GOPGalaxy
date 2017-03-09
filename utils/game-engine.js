var Graph = require('./classes/graph').Graph;
var Edge = require('./classes/graph').Edge;
var Node = require('./classes/graph').Node;
var Opportunity = require('./classes/opportunity');
var FuturFleet = require('../entities/futur-fleet');

module.exports = class GameEngine {
    constructor(game) {
        this.graph = this.buildGraph(game.planets);
        this.coveringGraph = this.buildCoveringGraph(this.graph, game.planets.find(p => p.owner == 1).id);
        this.unitOffset = 1;
        this.fleetSize = 3;
    }

    computeNextRound(game) {
        var self = this;

        game.ownedPlanets()
            .map(p => [ p, self.coveringGraph.edgesFor(p.id) ])
            .filter(e => e[1] != null)
            .forEach((e) => {
                var sourcePlanet = e[0];
                e[1].forEach((edge) => {
                    var destinationPlanet = self.graph.nodeWithId(edge.otherId(sourcePlanet.id)).planet;

                    console.log(edge);

                    var neededUnits = self.computeNeededUnits(sourcePlanet.timeTo(destinationPlanet.x, destinationPlanet.y), sourcePlanet, game)
                    var survivalUnits = 0;// self.computeSurvivalUnits(sourcePlanet, game);
                    var availableUnits = sourcePlanet.units - survivalUnits;
                    var unitsToSend = neededUnits;

                    // console.log("Survival : " + survivalUnits + " | Available : " + availableUnits + " | Needed : " + unitsToSend);
                    if (neededUnits > availableUnits) {
                        unitsToSend = availableUnits;
                    }

                    if (unitsToSend < self.fleetSize && availableUnits > self.fleetSize) {
                        unitsToSend = self.fleetSize;
                    }

                    if (unitsToSend >= self.fleetSize && !game.isTerraforming(sourcePlanet) && destinationPlanet.owner != 1) {
                        this.sendUnits(unitsToSend, sourcePlanet, destinationPlanet, game);
                    }
                });
            });

        // game.ownedPlanets()
        //     .filter(planet => planet.terraformable())
        //     .forEach(function(planet) {
        //         if (planet.growthRate < 3 && (game.maxTurns - game.turn > planet.growthRate * 2 + 20)) {
        //             console.log("terraforming planet " + planet.id)
        //             game.terraformings.push({ planet: planet.id });
        //         }
        //     });
        //
        // var maxSupportPlanets = Math.floor(game.ownedPlanets().length / 2);
        // game.ownedPlanets()
        //     .forEach(function(sourcePlanet) {
        //         game.planets
        //             .filter(planet => planet.id != sourcePlanet.id)
        //             .map(planet => new Opportunity(sourcePlanet, planet, self.computeNeededUnits(sourcePlanet.timeTo(planet.x, planet.y), planet, game), game.turn))
        //             .sort((o1, o2) => o2.getInterest() - o1.getInterest())
        //             .forEach(function(opportunity) {
        //                 // console.log(opportunity.neededUnits + "," + opportunity.distance + "," + opportunity.destinationPlanet.growthRate + "," + opportunity.destinationPlanet.owner + "," + opportunity.interest);
        //
        //                 var survivalUnits = self.computeSurvivalUnits(opportunity.sourcePlanet, game);
        //                 var availableUnits = opportunity.sourcePlanet.units - survivalUnits;
        //                 var unitsToSend = opportunity.neededUnits;
        //
        //                 // console.log("Survival : " + survivalUnits + " | Available : " + availableUnits + " | Needed : " + unitsToSend);
        //                 if (opportunity.neededUnits > availableUnits) {
        //                     unitsToSend = availableUnits;
        //                 }
        //
        //                 if (unitsToSend < fleetSize && availableUnits > fleetSize) {
        //                     unitsToSend = fleetSize;
        //                 }
        //
        //                 if (unitsToSend >= fleetSize && !game.isTerraforming(opportunity.sourcePlanet) && (!opportunity.isSupportFleet() || (opportunity.isSupportFleet() && game.supportPlanets().length <= maxSupportPlanets))) {
        //                     this.sendUnits(unitsToSend, opportunity, game);
        //                 }
        //             });
        //     });
    }

    buildGraph(planets) {
        var nodes = planets.map(p => new Node(p));

        var edges = planets.map(planet => {
                var currentNode = nodes.find(n => n.id == planet.id);

                var e = planets.filter(p => p.id != planet.id)
                    .map(p => {
                        var secondNode = nodes.find(n => n.id == p.id);
                        if (secondNode.processed) {
                            return undefined;
                        }

                        return new Edge([ currentNode.id, secondNode.id ], planet.distanceFrom(p.x, p.y));
                    }).filter(e => e);

                currentNode.processed = true;

                return e;
            })
            .reduce((x, y) => x.concat(y), []);

        return new Graph(nodes, edges);
    }

    buildCoveringGraph(graph, startPlanetId) {
        var edges = [];

        graph.reset();
        var startNode = graph.nodeWithId(startPlanetId);
        startNode.processed = true;

        var lightestEdge = (graph) => {
            return graph.edges
                .filter(e => {
                    var firstNode = graph.nodeWithId(e.nodeIds[0]);
                    var secondNode = graph.nodeWithId(e.nodeIds[1]);

                    return (firstNode.processed && !secondNode.processed) || (!firstNode.processed && secondNode.processed);
                })
                .sort((e1, e2) => e1.weight - e2.weight)[0];
        }

        while (!graph.nodes.every(n => n.processed)) {
            var selectedEdge = lightestEdge(graph);
            selectedEdge.nodeIds.map(i => graph.nodeWithId(i)).find(n => !n.processed).processed = true;

            edges.push(selectedEdge);
        }

        return new Graph(graph.nodes, edges);
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

        return planet.units + growth + fleetUnits + futurFleetUnits + this.unitOffset;
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

    sendUnits(units, sourcePlanet, destinationPlanet, game) {
        sourcePlanet.units -= units;

        var futurFleet = new FuturFleet(units, sourcePlanet, destinationPlanet);
        game.futurFleets.push(futurFleet);
    }
};
