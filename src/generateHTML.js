module.exports = {
	generateLocationHTML : function(location,scores,current_date,path) {
        html_str = "<link href='https://caullireau.com/style_tripavisor.css' rel='stylesheet'>"
        
        html_str += "<center><header><font face='Helvetica'><h1 class='title_main'> Analyse de " + location[0].name  + "</h1> </font></header></center>";
        //html_str += "<p>" + location[0].locationDescription + "<p>"
   
        location[0].reviewList.reviews.forEach((review) =>{
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

            html_str += "<h2> Notre analyse : " + scores[review.id]  + "</h2>"

            html_str += "<p class='read-more'>"
            html_str += "<a href='file:///"+ path.replace('/','') + "/results/"+ location[0].locationId + "/"  + current_date + "/profils/" +  review.userId + "/index.html'> Voir le profil </a>"
            html_str += "</p>"


            html_str += "</div>"
            html_str += "</div>"
        })
        return html_str
    },
    generateProfilHTML : function(profil){


        html_str = "<link href='https://caullireau.com/style_tripavisor.css' rel='stylesheet'>"

        html_str += "<center><header><font face='Helvetica'><h1 class='title_main'> Profil de " + profil[0].actor.displayName  + "</h1> </font></header></center>";


        profil.forEach((review) =>{
            console.log(review)
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
    }
}