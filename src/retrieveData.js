const fetch  = require("node-fetch");
const fs = require('fs');

const tools = require('./tools.js')

let url = "https://api.tripadvisor.com/api/internal/1.0/graphql/?currency=EUR&lang=fr_FR"
let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-TripAdvisor-API-Key': 'ce957ab2-0385-40f2-a32d-ed80296ff67f',
  'X-TripAdvisor-UUID': '3635d637-5325-4797-bfec-a30662d92450',
  'Accept-Encoding': 'gzip'
};
let queryReviews = fs.readFileSync("./src/queryReviews.graphql", 'utf8');
let queryProfil = fs.readFileSync("./src/queryProfil.graphql", 'utf8');

module.exports = {
  validUrl: function (str) {
    let pattern = new RegExp('^(https:\\/\\/)?(www\.tripadvisor\.(fr || com))','i');
    return pattern.test(str);
  },
  parseUrl: function(url) {
    let pattern = new RegExp('-d\\d+-', 'g');
    let locationId = pattern.exec(url)[0]
    return locationId.substring(2).slice(0, -1);
  },
  getLocation: async function(locationId, currentDate) {
    let bodyReviews = JSON.stringify({
      operationName: 'HotelReview',
      variables: { 
          "locationId":locationId,
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
    let res = await fetch(url, {headers: headers, method: "POST", body: bodyReviews})
    let json = await res.json()
    let path =  `results/${locationId}/${currentDate}/data/location.json`
    tools.writeDataFile(path, json)

    return json['data']['locations'][0]
  },
  getProfils: async function(location, currentDate, debug) {
    let profils = await Promise.all(
      location['reviewList']['reviews'].map(async review => {
        let profilResponse = await this.getFetchProfil(review['userId'])
        return profilResponse.json();
      })
    )

    let profilsWithKey = []
    profils = profils.map((profil) => {
        profilsWithKey[profil['data']['socialFeed']['sections'][0]['actor']['userId']] = profil['data']['socialFeed']['sections']
    })

    for (profilId in profilsWithKey) {
      let path = `results/${location['locationId']}/${currentDate}/profils/${profilId}/profil.json`
      tools.writeDataFile(path, profilsWithKey[profilId])
    }

    return profilsWithKey
    
  },
  getFetchProfil: async function(idProfil) {
    let bodyProfil = JSON.stringify({
      operationName: 'ProfileFeed',
      variables: {
        "userId":idProfil,
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
    return fetch(url, {headers: headers, method: "POST", body: bodyProfil})
  }
}