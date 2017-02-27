module.exports.Graph = class Graph {
    constructor(edges) {
        this.edges = edges;
    }
};

module.exports.Edge = class Edge {
    constructor(planets, weight) {
        this.planets = planets;
        this.weight = weight;
    }
}
