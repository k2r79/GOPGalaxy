module.exports = class Fleet {

    constructor(owner, units, sourcePlanetId, destinationPlanetId, totalRounds, roundsLeft) {
        this.owner = owner;
        this.units = units;
        this.sourcePlanetId = sourcePlanetId;
        this.destinationPlanetId = destinationPlanetId;
        this.totalRounds = totalRounds;
        this.roundsLeft = roundsLeft;
    }
}
