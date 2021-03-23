const config = require('../config.json');

module.exports = {
    profilHasPersonnalAvatar : function(review, profil, location, currentDate) {
        return profil.actor.avatar.caption.substring(0, 7) !== "default" ? config['profilHasPersonnalAvatar'] : 0
    },
    numberReviews : function(review, profil, location, currentDate) {
        return 0
    },
    rateDeviationAverage : function(review, profil, location, currentDate) {
        return 0
    },
    monthReviewsFrequency : function(review, profil, location, currentDate) {
        return 0
    },
    accountCreation : function(review, profil, location, currentDate) {
        return 0
    },
}