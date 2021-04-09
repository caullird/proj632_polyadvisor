const config = require('../config.json');
var fetch = require('node-fetch');
var stringSimilarity = require("string-similarity");
const geolib = require('geolib');

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

        let diff = []
        for(let i = 0; i < data.length - 1; i++){
            var date1 = new Date(data[i + 1])
            var date2 = new Date(data[i])
            diff.push((date2.getTime() - date1.getTime()) / (1000 * 3600 * 24))
        }

        let sum = count = malus = 0
        diff.forEach((date_diff) => {
            if(date_diff < 30){
                sum += date_diff
                count += 1
                if(sum > 30)
                    sum = count = 0
                if((count >= config['limitMonthReview']) && (count > malus))
                    malus = count
            }else
                sum = count = 0
        })
        return (malus - 10) * config['reviewInMonth']
    },
    rateDistanceAverage : async function(review, profil, location, currentDate) {
        let data = []
        profil.forEach((review) => {

            // TODO : comparaison des distances 
            //console.log(geolib.getDistance([40.76, -73.984],[38.89, -77.032]))
            
            data.push(
                [
                    review.items[0].feedSectionObject.location.locationId, 
                        [
                            review.items[0].feedSectionObject.location.latitude,
                            review.items[0].feedSectionObject.location.longitude
                        ],
                    review.items[0].feedSectionObject.publishedDate 
                ]
            )
        })
        return 0
    },
    rateHelfulAverage : function(review, profil, location, currentDate) {
        let count = sum = 0
        profil.forEach((review) => {
            count++
            sum += review.items[0].feedSectionObject.helpfulVotes
        })

        return ( sum / count )* config['helpfulVotesAverage']
    },
    rateStandardDeviationReview : function(review, profil, location, currentDate) {
        // TODO : determiner l'écart type
        return 0
    }
}
