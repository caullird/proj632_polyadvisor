module.exports = {
    removeAverageReviews : function(location) {
    
        location['reviewList']['reviews'] = location['reviewList']['reviews'].filter((review) => {
          return review.rating == 5 || review.rating == 1
        })

        return location
  }
}