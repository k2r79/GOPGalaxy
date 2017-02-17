module.exports = class FuturFleet {

    constructor(units, sourcePlanet, destinationPlanet) {
        this.units = units;
        this.sourcePlanet = sourcePlanet;
        this.destinationPlanet = destinationPlanet;
        this.duration = sourcePlanet.timeTo(destinationPlanet.x, destinationPlanet.y);
    }

    jsonResponse() {
        return {
            units: this.units,
            source: this.sourcePlanet.id,
            target: this.destinationPlanet.id
        }
    }
}
