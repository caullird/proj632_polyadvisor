'use strict';

const minimist = require('minimist');
const { exit } = require('process');
const tools = require('./tools.js');
const analyze = require('./analyze.js');

const retrieveData = require('./retrieveData.js')
const wordsCloud = require('./wordsCloud.js')

const currentDate = new Date().getTime()

let args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'version'
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

if (typeof args['_'][0] !== 'string' || !retrieveData.validUrl(args['_'][0]))
    throw 'Command need an URL argument ! Example : node .\\main.js <URL>';

let URL = args['_'][0];
let locationID = retrieveData.parseUrl(args['_'][0]);

(async () => {
    let location = await retrieveData.getLocation(locationID, currentDate)
    let profils = await retrieveData.getProfils(location, currentDate)

    wordsCloud.getFrom(locationID, location, currentDate)
    let analyzes = analyze.getAnalyzes(location, profils, currentDate)
})();
