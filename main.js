const fetch  = require("node-fetch");
const fs = require('fs');

let query = fs.readFileSync("./query", 'utf8');

let url = "https://api.tripadvisor.com/api/internal/1.0/graphql/?currency=EUR&lang=fr_FR"

let headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-TripAdvisor-API-Key': 'ce957ab2-0385-40f2-a32d-ed80296ff67f',
    'Accept-Encoding': 'gzip'
};

let body = JSON.stringify({
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
    query: query
});

fetch(url, {headers: headers, method: "POST", body: body})
    .then(function(res){ return res.text() })
    .then(function(res){console.log(res)})