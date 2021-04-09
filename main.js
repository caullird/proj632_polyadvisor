'use strict';

const minimist = require('minimist');
const { exit } = require('process');


const retrieveData = require('./src/retrieveData.js')
const scoreProfil = require('./src/scoreProfil.js')
const scoreReview = require('./src/scoreReview.js')
const analyseReport = require('./src/analyseReport.js')
const generateHTML = require('./src/generateHTML.js')
const tools = require('./src/tools.js')
const nlp = require('./src/nlp.js')
var fs = require('fs');
var http = require('http');
var opn = require('opn');


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

    let path = process.cwd()

    for (let review of location['reviewList']['reviews']) {

        let idReview =  review['id']
        let idProfil = review['userId']
        scores[idReview] = 0

        // Creation analyse json 
        var analyze = {}
        analyze['location'] = [];
        analyze['review'] = [];
        analyze['profil'] = [];
        analyze['score'] = [];

        analyze['location'].push(await analyseReport.saveLocationData(location))
        analyze['review'].push(await analyseReport.saveReviewData(review))
        analyze['profil'].push(await analyseReport.saveProfilData(profils[idProfil]))


        for (const method in scoreProfil) {
            let score = parseInt(await scoreProfil[method](review, profils[idProfil], location, currentDate))
            scores[idReview] += score
            analyze['profil'].push({"method" : method, "score" : score})
        }
        for (const method in scoreReview) {
            let score = parseInt(await scoreReview[method](review, profils[idProfil], location, currentDate))
            scores[idReview] += score
            analyze['review'].push({"method" : method, "score" : score})
        }
        // nlp.scan(review, currentDate)
        analyze['score'].push({"final_score" : scores[idReview] })

        // Write result file
        let path = `results/${locationID}/${currentDate}/review_analyze/${idReview}.json`
        tools.writeFile(path, analyze)

        let profilHTML = await generateHTML.generateProfilHTML(profils[idProfil])

        

        fs.writeFileSync(`results/${locationID}/${currentDate}/profils/${idProfil}/index.html`, profilHTML)
    }
    let localisationHTML = await generateHTML.generateLocationHTML(analyze['location'],scores, currentDate, path)

    fs.writeFileSync(`results/${locationID}/${currentDate}/data/index.html`, localisationHTML)

    opn(`results/${locationID}/${currentDate}/data/index.html`, {app: 'firefox'})


})();
