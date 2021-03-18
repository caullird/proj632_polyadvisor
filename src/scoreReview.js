const config = require('../config.json');

module.exports = {
    reviewHasPhotos : function(review, profil, location, currentDate) {
        return review.photos.length > 0 ? config['reviewHasPhotos'] : 0
    },
    helpfulVote : function(review, profil, location, currentDate) {
        return 0
    },
    rateDeviation: function(review, profil, location, currentDate) {
        return 0
    }
}