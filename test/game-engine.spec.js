let chai = require('chai');
chai.should();

var queryParser = require('../utils/query-parser');
var GameEngine = require('../utils/game-engine');

let queryBody = JSON.parse('{"planets":[{"id":1,"x":649.796284501,"y":398.89000339,"owner":0,"units":87,"mu":87,"gr":0,"classe":"J","tr":null},{"id":2,"x":1280.9996734665,"y":541.918587034,"owner":1,"units":1,"mu":200,"gr":5,"classe":"M","tr":null},{"id":3,"x":18.592895535110003,"y":255.8614197442,"owner":2,"units":1,"mu":200,"gr":5,"classe":"M","tr":null},{"id":4,"x":526.4548211455,"y":290.88893512359994,"owner":0,"units":45,"mu":200,"gr":5,"classe":"M","tr":null},{"id":5,"x":773.1377478565,"y":506.89107165400003,"owner":0,"units":45,"mu":200,"gr":5,"classe":"M","tr":null}],"fleets":[],"config":{"id":1,"turn":5,"maxTurn":200}}');
var game;
var gameEngine

describe('The game engine', () => {

    beforeEach(() => {
        game = queryParser.parseBody(queryBody);
        gameEngine = new GameEngine(game);
    });

    describe('graph', () => {
        it("is correct", () => {
            gameEngine.graph.nodes.length.should.equal(game.planets.length);
            gameEngine.graph.edges.length.should.equal((game.planets.length * (game.planets.length - 1)) / 2);

            gameEngine.graph.edges
                .forEach(edge => {
                    console.log(edge.toString());
                    var p1 = game.planets.find(planet => planet.id == edge.nodeIds[0]);
                    var p2 = game.planets.find(planet => planet.id == edge.nodeIds[1]);
                    edge.weight.should.equal(p1.distanceFrom(p2.x, p2.y));
                });
        });

        it("is can be optimally covered", () => {
            gameEngine.coveringGraph.edges.length.should.equal(game.planets.length - 1);

            gameEngine.coveringGraph.edgeBetween(2, 5).should.not.be.null;
            gameEngine.coveringGraph.edgeBetween(5, 1).should.not.be.null;
            gameEngine.coveringGraph.edgeBetween(1, 4).should.not.be.null;
            gameEngine.coveringGraph.edgeBetween(4, 3).should.not.be.null;
        });
    });
});
