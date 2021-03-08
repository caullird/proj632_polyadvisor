'use strict';

const minimist = require('minimist');
const { exit } = require('process');
const tools = require('./tools.js');
const analyze = require('./analyze.js');

let currentDate = new Date().getTime()

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


    let analyzes = analyze.getAnalyzes(locationID, currentDate)


})();
