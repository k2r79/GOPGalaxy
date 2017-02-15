module.exports = class Game {

    constructor(id, turn, maxTurns, planets, fleets) {
        this.id = id;
        this.turn = turn;
        this.maxTurns = maxTurns;
        this.planets = planets;
        this.fleets = fleets;
        this.futurFleets = [];
    }

    jsonResponse() {
        return {
            fleets: this.futurFleets.map(function(fleet) {
                return fleet.jsonResponse();
            }),
            terraformings: []
        }
    }

    ownedPlanets() {
        return this.planets.filter(planet => planet.owner == 1);
    }

    aimedPlanets() {
        var aimedPlanetIds = this.fleets.map(fleet => fleet.destinationPlanetId)
            .concat(this.futurFleets.map(fleet => fleet.destinationPlanetId));

        return this.planets.filter(planet => aimedPlanetIds.includes(planet.id));
    }
}
