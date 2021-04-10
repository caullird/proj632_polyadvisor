// Import personal module
const retrieveData = require('./src/retrieveData.js')
const scoreProfil = require('./src/scoreProfil.js')
const scoreReview = require('./src/scoreReview.js')
const generateHTML = require('./src/generateHTML.js')
const filters = require('./src/filters.js')
const tools = require('./src/tools.js')
const nlp = require('./src/nlp.js')

// Unique cosntant for the generated files
const currentDate = new Date().getTime()

if (typeof process.argv[2] !== 'string' || !retrieveData.validUrl(process.argv[2]))
    throw 'Command need an URL argument ! Example : node .\\main.js <URL>';

let URL = process.argv[2];
let locationID = retrieveData.parseUrl(process.argv[2]);
let path = `results/${locationID}/${currentDate}`;

(async () => {
    // Get information about the location and information about the people having reacted on the location
    let location = await retrieveData.getLocation(locationID, currentDate)
    let profils = await retrieveData.getProfils(location, currentDate)
    let scores = {}

    // Filter review
    // for (const method in filters) {
    //     location = await filters[method](location)
    // }

    // For each reviews
    for (let review of location['reviewList']['reviews']) { 
        let idProfil = review['userId']
        scores[review['id']] = {}
        scores[review['id']]['total'] = 0
        scores[review['id']]['profil'] = []
        scores[review['id']]['review'] = []

        for (const method in scoreProfil) {
            let score = parseInt(await scoreProfil[method](review, profils[idProfil], location, currentDate))
            scores[review['id']]['total'] += score
            scores[review['id']]['profil'].push({"method" : method, "score" : score})
        }
        for (const method in scoreReview) {
            let score = parseInt(await scoreReview[method](review, profils[idProfil], location, currentDate))
            scores[review['id']]['total'] += score
            scores[review['id']]['review'].push({"method" : method, "score" : score})
        }

        // Generate html profil file and save it
        let profilHTML = await generateHTML.generateProfilHTML(profils[idProfil])
        await tools.writeHtmlFile(path+`/profils/${idProfil}/index.html`, profilHTML)

        // Generate detail analyse file and save it
        let detailsAnalyseHTML = await generateHTML.generateDetailsAnalyseHTML(review, profils[idProfil], scores[review['id']])
        await tools.writeHtmlFile(path+`/profils/${idProfil}/detailsAnalyse.html`, detailsAnalyseHTML)

    }

    // Generate Html location file and save it
    // let pathToReview = `results/${locationID}/${currentDate}/review_analyze/${idReview}.json`
    let localisationHTML = await generateHTML.generateLocationHTML(location, scores, currentDate, 'a')
    await tools.writeHtmlFile(path+`/data/index.html`, localisationHTML)

    // Opens the generated page in the browser
    // opn(`results/${locationID}/${currentDate}/data/index.html`, {app: 'chrome'})
    process.send(`results/${locationID}/${currentDate}/data/index.html`);
})();
