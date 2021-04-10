var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// Create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));
app.get('/', function (req, res) {
    res.sendFile( __dirname + "/" + "index.html" );
})

app.post('/', urlencodedParser, function (req, res) {
    let url_trip = req.body.url_trip
    let process = require('child_process').fork('main.js', [url_trip]);

    process.on('close', function (code) {
        if (code !== 0) {
            console.log('Child process exit with code: ' + code)
            res.sendFile( __dirname + "/" + "index.html" );
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