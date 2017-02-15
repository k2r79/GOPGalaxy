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
}
