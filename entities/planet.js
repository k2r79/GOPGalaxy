module.exports = class Planet {

    constructor(id, x, y, owner, units, maxUnits, growthRate, type, terraforming) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.units = units;
        this.maxUnits = maxUnits;
        this.growthRate = growthRate;
        this.type = type;
        this.terraforming = terraforming;
    }

    distanceFrom(x, y) {
        var xDistance = this.x - x;
        var yDistance = this.y - y;
        var distance = xDistance * xDistance + yDistance * yDistance;

        return Math.sqrt(distance);
    }

    timeTo(x, y) {
        return Math.floor(this.distanceFrom(x, y) / 20);
    }

    terraformable() {
        return ['H', 'K', 'L'].includes(this.type) && this.terraforming == null;
    }
}
