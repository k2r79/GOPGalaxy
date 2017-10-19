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

        this.interest -= this.neededUnits / 10;

        if (this.destinationPlanet.owner != 0) {
            this.interest -= this.distance / 85;
        } else {
            this.interest -= this.distance / 130;
        }

        if (this.neededUnits < 0) {
            this.interest = - Infinity;
        }

        if (this.destinationPlanet.owner == 1) {
            if (this.neededUnits - this.destinationPlanet.growthRate * this.sourcePlanet.timeTo(this.destinationPlanet) > 0) {
                this.interest = Infinity;
            } else {
                this.interest = - Infinity;
            }

            if (this.destinationPlanet.units == this.destinationPlanet.maxUnits) {
                this.interest = - Infinity;
            }
        }

        // var growthRateBias = this.destinationPlanet.growthRate * 0.75;
        // if (this.destinationPlanet.owner > 1) {
        //     this.interest -= growthRateBias;
        // } else {
        //     this.interest += growthRateBias;
        // }

        // if (this.destinationPlanet.owner == 0) {
        //     this.interest += 15;
        // } else if (this.destinationPlanet.owner == 1) {
        //     this.interest -= 10;
        // } else if (this.destinationPlanet.owner == 1 && this.neededUnits > 0) {
        //     this.interest += 20;
        // }

        console.log("Planet " + this.destinationPlanet.id + " | Owner : " + this.destinationPlanet.owner + " | Needed : " + this.neededUnits + " | Interest : " + this.interest)

        return this.interest;
    }
};
