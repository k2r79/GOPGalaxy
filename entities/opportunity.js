module.exports = class Opportunity {

    constructor(sourcePlanet, destinationPlanet) {
        this.sourcePlanet = sourcePlanet;
        this.destinationPlanet = destinationPlanet;
        this.distance = this.sourcePlanet.distanceFrom(this.destinationPlanet.x, this.destinationPlanet.y);
    }

    getInterest() {
        var interest = 0;

        interest -= this.distance / 50;
        interest += this.destinationPlanet.growthRate;
        interest += this.destinationPlanet.owner == 0 ? 2 : 0;

        return interest;
    }
};
