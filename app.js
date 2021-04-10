const fs = require('fs');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {

    let history = []
    let locationFiles = fs.readdirSync(__dirname + "/results");
    locationFiles.forEach(locationFile => {
        let datedFiles = fs.readdirSync(__dirname + "/results/" + locationFile);
        let data = fs.readFileSync(`${__dirname}/results/${locationFile}/${datedFiles[0]}/data/location.json`, 'utf8');
        let json = JSON.parse(data);
        let name = json.data.locations[0].name + ", " + json.data.locations[0].geoName
        
        history.push({
            "locationName": name,
            "path": `./results/${locationFile}/${datedFiles[0]}/data/`
        });
    });

    res.render(__dirname + "/" + "index", { history: history });
})
app.get('/style.css', function (req, res) {
    res.sendFile( __dirname + "/" + "style.css" );
})

app.post('/', urlencodedParser, function (req, res) {
    let url_trip = req.body.url_trip
    let process = require('child_process').fork('main.js', [url_trip]);

    process.on('close', function (code) {
        if (code !== 0) {
            console.log('Child process exit with code: ' + code)
            res.writeHead(302, {'Location': "."});
            res.end();
        }
    });

    process.on('message', function (m) {
        res.writeHead(302, {'Location': m});
        res.end();
    });
})

app.get('/results/*', function (req, res) {
    console.log(__dirname + "/" + req.url);
    res.sendFile( __dirname + "/" + req.url );
});

var server = app.listen(3000, function () {
    console.log("Serveur running in http://localhost:3000")
})