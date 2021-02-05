// tools.js
const fetch  = require("node-fetch");
const fs = require('fs');

let url = "https://api.tripadvisor.com/api/internal/1.0/graphql/?currency=EUR&lang=fr_FR"
let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-TripAdvisor-API-Key': 'ce957ab2-0385-40f2-a32d-ed80296ff67f',
  'X-TripAdvisor-UUID': '3635d637-5325-4797-bfec-a30662d92450',
  'Accept-Encoding': 'gzip'
};
let queryReviews = fs.readFileSync("./queryReviews.graphql", 'utf8');
let queryProfil = fs.readFileSync("./queryProfil.graphql", 'utf8');

module.exports = {
  validURL: function (str) {
    let pattern = new RegExp('^(https:\\/\\/)?(www\.tripadvisor\.com)','i'); // fragment locator
    return !!pattern.test(str);
  },
  getLocationId: function(url) {
    let pattern = new RegExp('d\\d{6}', 'g');
    let locationId = pattern.exec(url)[0]
    return locationId.substring(1)
  },
  getLocation: async function(locationId, limit, currentDate) {
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
    this.writeFile(path, json)

    return json
  },
  getProfils: async function(location, currentDate) {

    let profils = await Promise.all(
      location['data']['locations'][0]['reviewList']['reviews'].map(async review => {
        let profilResponse = await this.getFetchProfil(review['userId'])
        return profilResponse.json()
      })
    )

    let locationId = location['data']['locations'][0]['locationId']

    // console.log(profils[0]['data']['socialFeed'])

    for (profil of profils) {
      let path = `results/${locationId}/${currentDate}/profils/${profil['data']['socialFeed']['sections'][0]['actor']['userId']}.json`

      this.writeFile(path, profil)

      console.log(profil)
    }

    return profils
    
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
  },
  writeFile : async function(path, data) {
    await fs.mkdirSync(path.substring(0, path.lastIndexOf("/")), { recursive: true });
    fs.writeFile(path, JSON.stringify(data, null, 2), 'utf8', function (err) {});
}
}