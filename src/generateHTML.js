module.exports = {
	generateLocationHTML : function(location,scores,current_date) {
        html_str = "<header class='page-header'> <h1> Analyse de '" + location[0].name +"' Le "+ current_date +"</h1></header>";
        html_str += "<p>" + location[0].locationDescription + "<p>"

        html_str += "<h2> Les avis de ce restaurant </h2>"
        location[0].reviewList.reviews.forEach((review) =>{
        	html_str += "<h3> Avis de " + review.userProfile.displayName + "</h3>"
        	html_str += "<p>" + review.title + "</p>" 
        	html_str += "<p>" + review.text  + "</p>"
        	html_str += "<p> Notre analyse </p>"
        	html_str += scores[review.id]
        })
        return html_str
    },
}