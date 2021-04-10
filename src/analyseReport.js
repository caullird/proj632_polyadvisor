module.exports = {
	saveLocationData : function(location) {
        let delete_list = [
        	'__typename','geoName','isGeo','locationTimezoneId',
        	'parent','detail','neighborhoods',
        	['reviewSummary','__typename'],['reviewList','preferredReviewIds'],
        	['reviewList','__typename'], ['reviewList','languageCounts']
        ]

        delete_list.forEach((element) => {
        	if(Array.isArray(element)){
    			delete location[element[0]][element[1]]
    		}else{
				delete location[element]
    		}
        })
        return location
    },
    saveReviewData : function(review) {
    	let delete_list = [['userProfile','_typename'],['userProfile','isFollowing'],['userProfile','isVerified'],'__typename','translationType','originalLanguage','additionalRatings','socialStatistics']

    	delete_list.forEach((element) => {
    		if(Array.isArray(element)){
    			delete review[element[0]][element[1]]
    		}else{
				delete review[element]
    		}
        })
        return review
    },

    saveProfilData : function(profil) {
    	profil.forEach((review) => {
    		let delete_list = ['__typename','sectionId','clusterId','type','uxHints','isFollowing','bio','title','subtitle','routeV2','linkText','reasonFor','shelfSponsorship','target']
    		delete_list.forEach((element) => {
	        	delete review[element]
	        })
    	})
    	return profil
    }
}