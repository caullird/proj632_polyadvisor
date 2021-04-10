const config = require('../config.json');
var stringSimilarity = require("string-similarity");
const geolib = require('geolib');
const utf8 = require('utf8');
const tools = require('./tools');

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
        
        if (hightestSimilarity - 0.5 > 0)
            return (hightestSimilarity - 0.5) * config['copyPaste']

        return 0
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
        if(malus != 0){
            return (malus - config['limitMonthReview']) * config['reviewInMonth']
        }
            
        return 0
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
    },
    distanceAndTimeBetweenEvaluation : async function(review, profil, location, currentDate) {
        let result = []

        for (let i = 0; i < profil.length - 1 ; i++) {
            const review = profil[i];
            const nextReview = profil[i+1];

            let reviewData = {
                createdDate: new Date(review.items[0].feedSectionObject.createdDate),
                position: {
                    latitude: review.items[0].feedSectionObject.location.latitude,
                    longitude: review.items[0].feedSectionObject.location.longitude
                }
            }
            let nextReviewData = {
                createdDate: new Date(nextReview.items[0].feedSectionObject.createdDate),
                position: {
                    latitude: nextReview.items[0].feedSectionObject.location.latitude,
                    longitude: nextReview.items[0].feedSectionObject.location.longitude
                }
            }

            if (reviewData.position.latitude == null || reviewData.position.longitude == null) {
                let locationName = utf8.encode(review.items[0].feedSectionObject.location.parent.additionalNames.long)
                reviewData.position = await tools.getCoordinateOfLocation(locationName)
            }

            if (nextReviewData.position.latitude == null || nextReviewData.position.longitude == null) {
                let locationName = utf8.encode(nextReview.items[0].feedSectionObject.location.parent.additionalNames.long)
                nextReviewData.position = await tools.getCoordinateOfLocation(locationName)
            }

            let diffDate = parseInt((reviewData.createdDate  - nextReviewData.createdDate) / (1000 * 60 * 60 * 24)) 
            let distance = geolib.getDistance(
                reviewData.position,
                nextReviewData.position
            );

            console.log(diffDate + " - " + distance)
        }

        return 0
    }
}
