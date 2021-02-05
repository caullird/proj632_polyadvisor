'use strict';

const minimist = require('minimist');
const fetch  = require("node-fetch");
const fs = require('fs');
const { exit } = require('process');
const tools = require('./tools.js')

let queryReviews = fs.readFileSync("./queryReviews.graphql", 'utf8');
let queryProfil = fs.readFileSync("./queryProfil.graphql", 'utf8');

let currentDate = new Date().getTime()

let url = "https://api.tripadvisor.com/api/internal/1.0/graphql/?currency=EUR&lang=fr_FR"

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-TripAdvisor-API-Key': 'ce957ab2-0385-40f2-a32d-ed80296ff67f',
    'X-TripAdvisor-UUID': '3635d637-5325-4797-bfec-a30662d92450',
    'Accept-Encoding': 'gzip'
};

let args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'version',
        l: 'limit',
    }
});

if (args.help) {
    console.log('aide');
    exit();
}

if (args.version) {
    console.log('version : 0.4.2');
    exit();
}

if (!args.limit) args.limit = 5;

if (typeof args['_'][0] !== 'string' || !tools.validURL(args['_'][0]))
    throw 'Command need an URL argument ! Example : node .\\main.js <URL>';

let URL = args['_'][0];
let locationID = tools.getLocationId(args['_'][0]);

(async () => {
    let location = await tools.getLocation(locationID, args.limit, currentDate)
    let profils = await tools.getProfils(location, currentDate)
})();
