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

        this.interest -= this.neededUnits / 30;
        this.interest -= this.distance / 500;

        var growthRateBias = this.destinationPlanet.growthRate * 0.75;
        if (this.destinationPlanet.owner > 1) {
            this.interest -= growthRateBias;
        } else {
            this.interest += growthRateBias;
        }

        if (this.destinationPlanet.owner == 0) {
            this.interest += 15;
        } else if (this.destinationPlanet.owner == 1) {
            this.interest -= 10;
        } else if (this.destinationPlanet.owner == 1 && this.neededUnits > 0) {
            this.interest += 20;
        }

        console.log("Planet " + this.destinationPlanet.id + "(" + this.destinationPlanet.owner + ") interest : " + this.interest)

        return this.interest;
    }
};
