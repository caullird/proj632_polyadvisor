const config = require('../config.json');

module.exports = {
    reviewHasPhotos : function(review, profil, location, currentDate) {
        return review.photos.length > 0 ? config['reviewHasPhotos'] : 0
    },
    helpfulVotes : function(review, profil, location, currentDate) {
        return review.helpfulVotes * config['helpfulVotes']
    },
    rateDeviation: function(review, profil, location, currentDate) {        
        return Math.sqrt(Math.pow(location['reviewSummary']['rating']- review.rating,2)) * config['rateDeviation']
    }
}