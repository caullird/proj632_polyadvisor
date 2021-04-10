module.exports = {
	generateLocationHTML : function(location,scores,current_date,path) {
        html_str = "<link href='https://caullireau.com/style_tripavisor.css' rel='stylesheet'>"
        
        html_str += "<center><header><h1 style='font-family: Poppins, sans-serif;' class='title_main'> Analyse de " + location.name  + "</h1></header></center>";
        
        location.reviewList.reviews.forEach((review) =>{
            html_str += "<div class='blog-card'>"
            html_str += "<div class='meta'>"
            html_str += "<div class='photo' style='background-image: url(https://www.hotel-baud.com/assets/img/restaurant/terrasse-restaurant-bonne-74.jpg)'></div>"
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
            html_str += "<a style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;' href='/results/"+ location.locationId + "/"  + current_date + "/profils/" +  review.userId + "/detailsAnalyse.html'> Voir le détails de notre analyse </a>"
            html_str += "<a style='background-color: #4CAF50;border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;margin: 4px 2px;cursor: pointer;' href='/results/"+ location.locationId + "/"  + current_date + "/profils/" +  review.userId + "/'> Voir le profil </a>"
            html_str += "</p>"


            html_str += "</div>"
            html_str += "</div>"
        })
        return html_str
    },
    generateProfilHTML : function(profil){

        html_str = "<link href='https://caullireau.com/style_tripavisor.css' rel='stylesheet'>"

        html_str += "<center><header><h1 class='title_main' style='font-family: Poppins, sans-serif;'> Profil de " + profil[0].actor.displayName  + "</h1></header></center>";


        profil.forEach((review) =>{
            html_str += "<div class='blog-card'>"
            html_str += "<div class='meta'>"
            html_str += "<div class='photo' style='background-image: url(https://www.acs-ami.com/fr/blog/wp-content/uploads/2015/07/inspiration-voyage.jpg)'></div>"
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
    generateDetailsAnalyseHTML : function(review, profil, score){

        html_str = "<link href='https://caullireau.com/style_tripavisor.css' rel='stylesheet'>"
        // html_str = "<link href='https://caullireau.com/style_tripavisor_table.css' rel='stylesheet'>"

        html_str += "<center><header><h1 class='title_main' style='font-family: Poppins, sans-serif;'> Detail de l'analyse de " + profil[0].actor.displayName  + "</h1></header></center>";

        html_str += "<div class='blog-card'>"
        html_str += "<div class='meta'>"
        html_str += "<div class='photo' style='background-image: url(https://www.hotel-baud.com/assets/img/restaurant/terrasse-restaurant-bonne-74.jpg)'></div>"
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
        html_str += "</div>"

        html_str += "<center>"
        html_str += "<table style='max-width: 1200px;border-collapse: collapse;margin: 25px 0;font-size: 0.9em;font-family: sans-serif;min-width: 1200px;box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);'>"
        html_str += "<thead>"
        html_str += "<tr style='background-color: #009879;color: #ffffff;text-align: left;'>"
        html_str += "<th style='padding: 12px 15px;'> Fonction d'analyse </th>"
        html_str += "<th style='padding: 12px 15px;'> Score </th>"
        html_str += "</tr>"
        html_str += "</thead>"

        html_str += "<tbody>"
        score['profil'].forEach((scoreProfil) =>{
            html_str += "<tr style='border-bottom: 1px solid #dddddd;'>"
            html_str += "<td style='padding: 12px 15px;'>" + scoreProfil.method + "</td>"
            html_str += "<td style='padding: 12px 15px;'>" + scoreProfil.score + "</td>"
            html_str += "</tr>"
        })

        score['review'].forEach((scoreReview) =>{
            html_str += "<tr style='border-bottom: 1px solid #dddddd;'>"
            html_str += "<td style='padding: 12px 15px;'>" + scoreReview.method + "</td>"
            html_str += "<td style='padding: 12px 15px;'>" + scoreReview.score + "</td>"
            html_str += "</tr>"
        })

        html_str += "</tbody>"

        html_str += "</table>"
        html_str += "</center>"

        return html_str
    },
}