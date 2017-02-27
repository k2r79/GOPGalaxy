let chai = require('chai');
chai.should();

var queryParser = require('../utils/query-parser');
var GameEngine = require('../utils/game-engine');

let queryBody = JSON.parse('{"planets":[{"id":1,"x":649.796284501,"y":398.89000339,"owner":0,"units":87,"mu":87,"gr":0,"classe":"J","tr":null},{"id":2,"x":1280.9996734665,"y":541.918587034,"owner":1,"units":1,"mu":200,"gr":5,"classe":"M","tr":null},{"id":3,"x":18.592895535110003,"y":255.8614197442,"owner":2,"units":1,"mu":200,"gr":5,"classe":"M","tr":null},{"id":4,"x":526.4548211455,"y":290.88893512359994,"owner":0,"units":45,"mu":200,"gr":5,"classe":"M","tr":null},{"id":5,"x":773.1377478565,"y":506.89107165400003,"owner":0,"units":45,"mu":200,"gr":5,"classe":"M","tr":null},{"id":6,"x":44.89895036497,"y":43,"owner":0,"units":46,"mu":46,"gr":1,"classe":"L","tr":null},{"id":7,"x":1254.6936186395,"y":754.78000678,"owner":0,"units":46,"mu":46,"gr":1,"classe":"L","tr":null},{"id":8,"x":295.61866562604996,"y":519.319251628,"owner":0,"units":46,"mu":46,"gr":1,"classe":"L","tr":null},{"id":9,"x":1003.973903374,"y":278.460755152,"owner":0,"units":46,"mu":46,"gr":1,"classe":"L","tr":null},{"id":10,"x":866.741151666,"y":426.873111805,"owner":0,"units":85,"mu":85,"gr":2,"classe":"H","tr":null},{"id":11,"x":432.851417336,"y":370.906894972,"owner":0,"units":85,"mu":85,"gr":2,"classe":"H","tr":null},{"id":12,"x":716.2844169585001,"y":243.92820590079998,"owner":0,"units":73,"mu":80,"gr":2,"classe":"L","tr":null},{"id":13,"x":583.3081520461,"y":553.8518008780001,"owner":0,"units":73,"mu":80,"gr":2,"classe":"L","tr":null},{"id":14,"x":1293.0925690020001,"y":397.898185732,"owner":0,"units":50,"mu":80,"gr":2,"classe":"M","tr":null},{"id":15,"x":6.5,"y":399.881821045,"owner":0,"units":50,"mu":80,"gr":2,"classe":"M","tr":null},{"id":16,"x":1171.423406283,"y":730.261616161,"owner":0,"units":36,"mu":80,"gr":2,"classe":"M","tr":null},{"id":17,"x":128.16916271575,"y":67.51839061645,"owner":0,"units":36,"mu":80,"gr":2,"classe":"M","tr":null},{"id":18,"x":782.9043441765,"y":217.83165174939998,"owner":0,"units":29,"mu":80,"gr":2,"classe":"M","tr":null},{"id":19,"x":516.6882248222499,"y":579.94835503,"owner":0,"units":29,"mu":80,"gr":2,"classe":"M","tr":null},{"id":20,"x":914.7846348549999,"y":314.9033542114,"owner":0,"units":8,"mu":160,"gr":4,"classe":"M","tr":null},{"id":21,"x":384.8079341444,"y":482.87665256799994,"owner":0,"units":8,"mu":160,"gr":4,"classe":"M","tr":null},{"id":22,"x":874.177724277,"y":618.037612756,"owner":0,"units":65,"mu":120,"gr":3,"classe":"K","tr":null},{"id":23,"x":425.4148447263,"y":179.7423940231,"owner":0,"units":65,"mu":120,"gr":3,"classe":"K","tr":null}],"fleets":[{"owner":1,"units":46,"from":2,"to":5,"turns":25,"left":20},{"owner":1,"units":9,"from":2,"to":20,"turns":21,"left":16},{"owner":1,"units":40,"from":2,"to":4,"turns":39,"left":34},{"owner":1,"units":9,"from":2,"to":21,"turns":44,"left":39},{"owner":1,"units":5,"from":2,"to":4,"turns":39,"left":35},{"owner":2,"units":51,"from":3,"to":15,"turns":7,"left":2},{"owner":1,"units":5,"from":2,"to":16,"turns":10,"left":7},{"owner":2,"units":47,"from":3,"to":6,"turns":10,"left":6},{"owner":2,"units":16,"from":3,"to":17,"turns":10,"left":7},{"owner":2,"units":5,"from":3,"to":17,"turns":10,"left":8},{"owner":1,"units":5,"from":2,"to":16,"turns":10,"left":8},{"owner":2,"units":5,"from":3,"to":17,"turns":10,"left":9},{"owner":1,"units":5,"from":2,"to":16,"turns":10,"left":9}],"config":{"id":1,"turn":5,"maxTurn":200}}');
var game;
var gameEngine

describe('The game engine', () => {

    beforeEach(() => {
        game = queryParser.parseBody(queryBody);
        gameEngine = new GameEngine(game);
    });

    describe('graph', () => {
        it("is correct", () => {
            gameEngine.graph.edges.length.should.equal((game.planets.length * (game.planets.length - 1)) / 2);

            gameEngine.graph.edges
                .forEach(edge => {
                    var p1 = game.planets.find(planet => planet.id == edge.planets[0]);
                    var p2 = game.planets.find(planet => planet.id == edge.planets[1]);
                    edge.weight.should.equal(p1.distanceFrom(p2.x, p2.y));
                });
        });
    });
});
