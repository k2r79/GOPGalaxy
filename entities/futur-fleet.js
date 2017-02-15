module.exports = class FuturFleet {

    constructor(units, sourcePlanet, destinationPlanet) {
        this.units = units;
        this.sourcePlanet = sourcePlanet;
        this.destinationPlanet = destinationPlanet;
    }

    jsonResponse() {
        return {
            units: this.units,
            source: this.sourcePlanet,
            target: this.destinationPlanet
        }
    }
}
