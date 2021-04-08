const config = require('../config.json');
var fetch = require('node-fetch');

module.exports = {
    profilHasPersonnalAvatar : function(review, profil, location, currentDate) {
        return profil[0].actor.avatar.caption.substring(0, 7) !== "default" ? config['profilHasPersonnalAvatar'] : 0
    },
    numberReviews : function(review, profil, location, currentDate) {
        return profil[0].actor.followerCount * config['numberFollowers']
    },
    numberFollowers : function(review, profil, location, currentDate) {
        return profil.length * config['numberReviews']
    },
    numberFollowers : function(review, profil, location, currentDate) {
        return profil[0].actor.followerCount * config['numberFollowers']
    },
    profilIsVerified : function(review, profil, location, currentDate) {
        return profil[0].actor.isVerified * config['profilIsVerified']
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
                if((count >= 10) && (count > malus))
                    malus = count
            }else
                sum = count = 0
        })
        return (malus - 10) * config['malus_to_much_comment']
    },
    rateDistanceAverage : async function(review, profil, location, currentDate) {
        return 0
    },
    accountCreation : function(review, profil, location, currentDate) {
        // @TODO
        return 0
    },
}