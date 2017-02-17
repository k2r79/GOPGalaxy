module.exports = class Game {

    constructor(id, turn, maxTurns, planets, fleets) {
        this.id = id;
        this.turn = turn;
        this.maxTurns = maxTurns;
        this.planets = planets;
        this.fleets = fleets;
        this.futurFleets = [];
        this.terraformings = [];
    }

    jsonResponse() {
        return {
            fleets: this.futurFleets.map(function(fleet) {
                return fleet.jsonResponse();
            }),
            terraformings: this.terraformings.map(planet => planet.id)
        }
    }

    ownedPlanets() {
        return this.planets.filter(planet => planet.owner == 1);
    }

    aimedPlanets() {
        var aimedPlanetIds = this.fleets.filter(fleet => fleet.owner == 1).map(fleet => fleet.destinationPlanetId)
            .concat(this.futurFleets.map(fleet => fleet.destinationPlanet.id));

        return this.planets.filter(planet => aimedPlanetIds.includes(planet.id));
    }

    ignoredPlanets() {
        return this.planets.filter(planet => !this.aimedPlanets().includes(planet));
    }

    fleetsTo(planetId) {
        return this.fleets
            .filter(fleet => fleet.destinationPlanetId == planetId);
    }

    futurFleetsTo(planetId) {
        return this.futurFleets
            .filter(fleet => fleet.destinationPlanet.id == planetId);
    }

    fleetsFrom(planetId) {
        return this.fleets
            .filter(fleet => fleet.sourcePlanetId == planetId);
    }

    futurFleetsFrom(planetId) {
        return this.futurFleets
            .filter(fleet => fleet.sourcePlanet.id == planetId);
    }
}
