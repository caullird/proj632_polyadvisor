'use strict';

const minimist = require('minimist');
const { exit } = require('process');

const retrieveData = require('./src/retrieveData.js')
const scoreProfil = require('./src/scoreProfil.js')
const scoreReview = require('./src/scoreReview.js')

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
    
    let scores = {}
    for (let review of location['reviewList']['reviews']) {
        let idReview =  review['id']
        let idProfil = review['userId']
        scores[idReview] = 0
        for (const method in scoreProfil) {
            scores[idReview] += parseInt(await scoreProfil[method](review, profils[idProfil], location, currentDate))
        }
        for (const method in scoreReview) {
            scores[idReview] += parseInt(await scoreReview[method](review, profils[idProfil], location, currentDate))
        }
    }
    console.log(scores)

})();
