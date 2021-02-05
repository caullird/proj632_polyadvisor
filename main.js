<<<<<<< HEAD
'use strict';

const minimist = require('minimist');
const fetch  = require("node-fetch");
const fs = require('fs');
const { exit } = require('process');
const tools = require('./tools.js')

let queryReviews = fs.readFileSync("./queryReviews.graphql", 'utf8');
let queryProfil = fs.readFileSync("./queryProfil.graphql", 'utf8');

let currentDate = new Date().getTime()
=======
const fetch  = require("node-fetch");
const fs = require('fs');

let queryReviews = fs.readFileSync("./queryReviews", 'utf8');
let queryProfil = fs.readFileSync("./queryProfil", 'utf8');
>>>>>>> dfecb13ec6346d2a61a4dcb141420849d5badbc9

let url = "https://api.tripadvisor.com/api/internal/1.0/graphql/?currency=EUR&lang=fr_FR"

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-TripAdvisor-API-Key': 'ce957ab2-0385-40f2-a32d-ed80296ff67f',
    'X-TripAdvisor-UUID': '3635d637-5325-4797-bfec-a30662d92450',
    'Accept-Encoding': 'gzip'
};

<<<<<<< HEAD
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
=======
let bodyReviews = JSON.stringify({
    operationName: 'HotelReview',
    variables: { 
        "locationId":3968848,
        "distanceUnit":"KILOMETERS",
        "language":"fr",
        "reviewFilters":[{
            "axis":"LANGUAGE",
            "selections":["fr"]
        }],
        "reviewPrefsCacheKey":"hotelReviewPrefs_3968848",
        "reviewFilterCacheKey":"hotelReviewFilters_3968848",
        "geoIds":[],
        "socialPartialResults":true,
        "keywordVariant":"location_keywords_v2_llr_order_30_fr"
    },
    query: queryReviews
});

let bodyProfil = JSON.stringify({
    operationName: 'ProfileFeed',
    variables: {
		"userId":"3E6DCBD2FE488371BACD2E773DCA2875",
		"reset":true,
		"filterType":["REVIEW"],
		"latitude":null,
		"longitude":null,
		"sessionType":"MOBILE_NATIVE",
		"distanceUnits":"KILOMETERS",
		"currency":"EUR",
		"includeSocialReferences":true
	},
    query: queryProfil
});


fetch(url, {headers: headers, method: "POST", body: bodyReviews})
    .then(function(res){ return res.text() })
    .then(function(res){
		fs.writeFileSync('dataReviews.json', res, 'utf8');
		console.log("len Review : "+res.length) //247883
		console.log(JSON.parse(res)['data']['locations'][0]['reviewList']['reviews'].length)
	})

fetch(url, {headers: headers, method: "POST", body: bodyProfil})
    .then(function(res){ return res.text() })
    .then(function(res){
		fs.writeFileSync('dataProfil.json', res, 'utf8');
		console.log("len Profil: "+res.length) //247883
	})
>>>>>>> dfecb13ec6346d2a61a4dcb141420849d5badbc9
