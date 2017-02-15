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
}
