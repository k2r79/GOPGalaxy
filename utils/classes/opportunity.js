module.exports = class Opportunity {

    constructor(sourcePlanet, destinationPlanet, neededUnits, turn) {
        this.sourcePlanet = sourcePlanet;
        this.destinationPlanet = destinationPlanet;
        this.neededUnits = neededUnits;
        this.turn = turn;
        this.distance = this.sourcePlanet.distanceFrom(this.destinationPlanet.x, this.destinationPlanet.y);
        this.interest = 0;
    }

    getInterest() {
        this.interest = 0;

        this.interest -= this.neededUnits / 20;
        this.interest -= this.distance / 80;


        if (this.neededUnits < 0) {
            this.interest = - Infinity;
        }

        if (this.destinationPlanet.owner == 1) {
            var missingUnits = this.neededUnits - this.destinationPlanet.growthRate * this.sourcePlanet.timeTo(this.destinationPlanet.x, this.destinationPlanet.y);
            if (missingUnits > 0 && missingUnits <= this.destinationPlanet.maxUnits) {
                this.interest = Infinity;
            } else {
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

        console.log("Planet " + this.destinationPlanet.id + " | Distance : " + this.distance + " | Owner : " + this.destinationPlanet.owner + " | Needed : " + this.neededUnits + " | Interest : " + this.interest)

        return this.interest;
    }

    isSupportFleet() {
        return this.sourcePlanet.owner == 1 && this.destinationPlanet.owner == 1;
    }
};
