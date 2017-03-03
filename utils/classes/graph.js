module.exports.Graph = class Graph {
    constructor(nodes, edges) {
        this.nodes = nodes;
        this.edges = edges;
    }

    nodeWithId(id) {
        return this.nodes.find(n => n.id == id);
    }

    edgesFor(planetId) {
        return this.edges.filter(e => e.nodeIds.includes(planetId));
    }

    edgeBetween(firstPlanetId, secondPlanetId) {
        return this.edges.find(e => e.nodeIds.includes(firstPlanetId) && e.nodeIds.includes(secondPlanetId));
    }

    reset() {
        this.nodes.forEach(n => n.processed = false);
    }
};

module.exports.Edge = class Edge {
    constructor(nodeIds, weight) {
        this.nodeIds = nodeIds;
        this.weight = weight;
    }

    otherId(id) {
        return this.nodeIds.find(i => i != id);
    }

    toString() {
        return this.nodeIds[0] + ' <-> ' + this.nodeIds[1] + " => " + this.weight;
    }
}

module.exports.Node = class Node {
    constructor(planet) {
        this.id = planet.id;
        this.planet = planet;
        this.processed = false;
    }
}
