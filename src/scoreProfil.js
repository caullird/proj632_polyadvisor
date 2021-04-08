const config = require('../config.json');
var fetch = require('node-fetch');
var stringSimilarity = require("string-similarity");

module.exports = {
    profilHasPersonnalAvatar : function(review, profil, location, currentDate) {
        return profil[0].actor.avatar.caption.substring(0, 7) !== "default" ? config['profilHasPersonnalAvatar'] : 0
    },
    numberReviews : function(review, profil, location, currentDate) {
        return profil.length * config['numberReviews']
    },
    numberFollowers : function(review, profil, location, currentDate) {
        return profil[0].actor.followerCount * config['numberFollowers']
    },
    profilIsVerified : function(review, profil, location, currentDate) {
        return profil[0].actor.isVerified * config['profilIsVerified']
    },
    copyPaste : function(review, profil, location, currentDate) {
        let reviews = []
        let hightestSimilarity = 0

        profil.map((review) => {
            reviews.push(review.items[0].feedSectionObject.text)
        })

        reviews.forEach((review, i) => {
            reviews.forEach((reviewCompare, u) => {
                let similarity = stringSimilarity.compareTwoStrings(review, reviewCompare);
                if (hightestSimilarity < similarity && i !== u) {
                    hightestSimilarity = similarity
                }
            })
        })
        
        return hightestSimilarity
    },
    monthReviewsFrequency : function(review, profil, location, currentDate) {
        let data = []
        profil.forEach((review) => {
            data.push(review.items[0].feedSectionObject.publishedDate)
        })
        console.log(data)

        for(let i = 0; i < data.length - 1; i++){
            var date1 = new Date(data[i + 1])
            var date2 = new Date(data[i])
            var time_diff = date2.getTime() - date1.getTime();
            var days_Diff = time_diff / (1000 * 3600 * 24);

            console.log(days_Diff)

        }
        return 0
    },
    monthReviewsFrequency : function(review, profil, location, currentDate) {
        // @TODO
        return 0
    },
    accountCreation : function(review, profil, location, currentDate) {
        // @TODO
        return 0
    },
}

function deg2rad(x){
    return Math.PI*x/180;
}

function get_distance_m($lat1, $lng1, $lat2, $lng2) {
    $earth_radius = 6378137;
    $rlo1 = deg2rad($lng1);
    $rla1 = deg2rad($lat1);
    $rlo2 = deg2rad($lng2);
    $rla2 = deg2rad($lat2);
    $dlo = ($rlo2 - $rlo1) / 2;
    $dla = ($rla2 - $rla1) / 2;
    $a = (Math.sin($dla) * Math.sin($dla)) + Math.cos($rla1) * Math.cos($rla2) * (Math.sin($dlo) * Math.sin($dlo
));
    $d = 2 * Math.atan2(Math.sqrt($a), Math.sqrt(1 - $a));
    return ($earth_radius * $d) / 1000;
}
