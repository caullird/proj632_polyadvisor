module.exports = {
	generateLocationHTML : function(location,scores,current_date,path) {
        html_str = "<link href='https://caullireau.com/style_tripavisor.css' rel='stylesheet'>"
        
        html_str += "<center><header><font face='Helvetica'><h1 class='title_main'> Analyse de " + location.name  + "</h1> </font></header></center>";
        
        location.reviewList.reviews.forEach((review) =>{
            html_str += "<div class='blog-card'>"
            html_str += "<div class='meta'>"
            html_str += `<a href=${review.absoluteUrl}><div class='photo' style='background-image: url(https://source.unsplash.com/1600x900/?${location.detail.__typename}&sig=${review.id})'></div></a>`
            html_str += "</div>"
            html_str += "<div class='description'>"
            html_str += "<h1>" + review.userProfile.displayName + "</h1>"
            html_str += "<h2>" + review.title + "</h2>"
            let nb_stairs = review.rating 
            for(let i = 0; i < nb_stairs; i++){
                html_str += "<img style='width:40px;' src='https://images.emojiterra.com/google/android-11/128px/2b50.png'>"
            }
            html_str += "<p>" + review.text + "</p>"

            html_str += "<h2> Notre analyse : " + scores[review.id]['total']  + "</h2>"

            html_str += "<p class='read-more'>"
            html_str += "<a href='/results/"+ location.locationId + "/"  + current_date + "/profils/" +  review.userId + "/detailsAnalyse.html'> Voir le détails de notre analyse </a>"
            html_str += "<a href='/results/"+ location.locationId + "/"  + current_date + "/profils/" +  review.userId + "/'> Voir le profil </a>"
            html_str += "</p>"


            html_str += "</div>"
            html_str += "</div>"
        })
        return html_str
    },
    generateProfilHTML : function(profil, location){

        html_str = "<link href='https://caullireau.com/style_tripavisor.css' rel='stylesheet'>"

        html_str += "<center><header><font face='Helvetica'><h1 class='title_main'> Profil de " + profil[0].actor.displayName  + "</h1> </font></header></center>";

        profil.forEach((review) =>{
            html_str += "<div class='blog-card'>"
            html_str += "<div class='meta'>"
            html_str += `<a href=${review.absoluteUrl}><div class='photo' style='background-image: url(https://source.unsplash.com/1600x900/?${location.detail.__typename}&sig=${review.items[0].feedSectionObject.reviewId})'></div></a>`
            html_str += "</div>"
            html_str += "<div class='description'>"
            html_str += "<h1> Visite à " + review.items[0].feedSectionObject.location.name + "</h1>"
            html_str += "<h2>" + review.items[0].feedSectionObject.title + "</h2>"
            let nb_stairs = review.items[0].feedSectionObject.rating 
            for(let i = 0; i < nb_stairs; i++){
                html_str += "<img style='width:40px;' src='https://images.emojiterra.com/google/android-11/128px/2b50.png'>"
            }
            html_str += "<p>" + review.items[0].feedSectionObject.text + "</p>"
            html_str += "</div>"
            html_str += "</div>"
        })

        return html_str
    },
    generateDetailsAnalyseHTML : function(review, profil, score, location){

        html_str = "<link href='https://caullireau.com/style_tripavisor.css' rel='stylesheet'>"

        html_str += "<center><header><font face='Helvetica'><h1 class='title_main'> Detail de l'analyse de " + profil[0].actor.displayName  + "</h1> </font></header></center>";

        html_str += "<div class='blog-card'>"
        html_str += "<div class='meta'>"
        html_str += `<a href=${review.absoluteUrl}><div class='photo' style='background-image: url(https://source.unsplash.com/1600x900/?${location.detail.__typename}&sig=${review.id})'></div></a>`
        html_str += "</div>"
        html_str += "<div class='description'>"
        html_str += "<h1>" + review.userProfile.displayName + "</h1>"
        html_str += "<h2>" + review.title + "</h2>"
        let nb_stairs = review.rating 
        for(let i = 0; i < nb_stairs; i++){
            html_str += "<img style='width:40px;' src='https://images.emojiterra.com/google/android-11/128px/2b50.png'>"
        }
        html_str += "<p>" + review.text + "</p>"

        html_str += "<h2> Notre analyse : " + score['total']  + "</h2>"

        html_str += "</div>"
        html_str += "</div>"

        score['profil'].forEach((scoreProfil) =>{
            html_str += JSON.stringify(scoreProfil, null, 2)
        })

        score['review'].forEach((scoreReview) =>{
            html_str += JSON.stringify(scoreReview, null, 2)
        })

        return html_str
    },
}