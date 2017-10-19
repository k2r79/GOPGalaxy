var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');

var queryParser = require('./utils/query-parser');
var gameEngine = require('./utils/game-engine');

var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

router.post('/', function(req, res) {
    //console.log(req.body);

    var game = queryParser.parseBody(req.body);
    writeToFile("queries-" + game.id + ".json", JSON.stringify(req.body));

    gameEngine.computeNextRound(game);

    response = game.jsonResponse();
    writeToFile("responses-" + game.id + ".json", JSON.stringify(response));
    console.log(response);

    res.json(response);
});

app.use('/', router);

var port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', function() {
    console.log('Listening on port ' + port);
});

function writeToFile(path, data) {
    fs.appendFile("logs/" + path, data + '\n', function(err) {
        if(err) {
            return console.log(err);
        }
    });
}
