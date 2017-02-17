module.exports = class Opportunity {

    constructor(sourcePlanet, destinationPlanet, neededUnits) {
        this.sourcePlanet = sourcePlanet;
        this.destinationPlanet = destinationPlanet;
        this.neededUnits = neededUnits;
        this.distance = this.sourcePlanet.distanceFrom(this.destinationPlanet.x, this.destinationPlanet.y);
        this.interest = 0;
    }

    getInterest() {
        this.interest = 0;

        this.interest -= this.neededUnits / 50;
        this.interest -= this.distance / 500;
        this.interest += this.destinationPlanet.growthRate * 0.75;

        if (this.destinationPlanet.owner == 0) {
            this.interest += 10;
        } else if (this.destinationPlanet.owner == 1 && this.neededUnits > 0) {
            this.interest += 20;
        }

        return this.interest;
    }
};
