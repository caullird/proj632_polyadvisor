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
        console.log(data)


        for(let i = 0; i < data.length - 1; i++){
            var date1 = new Date(data[i + 1])
            var date2 = new Date(data[i])
            var time_diff = date2.getTime() - date1.getTime();
            var days_Diff = time_diff / (1000 * 3600 * 24);

            console.log(days_Diff)

        }
        return 0
    },
    rateDistanceAverage : async function(review, profil, location, currentDate) {
        let prof_x = prof_y = location_x = location_y = null

        if(profil[0].actor.hometown.location){
            let url = 'https://api-adresse.data.gouv.fr/search/?q=' + profil[0].actor.hometown.location.name + '&limit=1'
            let res = await fetch(url)
            let json = await res.json()

            let coordinates = json.features[0].geometry.coordinates
            prof_x = coordinates[0]
            prof_y = coordinates[1]
        }

        if(location.streetAddress.fullAddress){
            let address = location.streetAddress.fullAddress.replace(',','').split(' ').join('+')

            let url = 'https://api-adresse.data.gouv.fr/search/?q=' + address + '&limit=1'
            let res = await fetch(url)
            let json = await res.json()

            let coordinates = json.features[0].geometry.coordinates
            location_x = coordinates[0]
            location_y = coordinates[1]
        }

        if(prof_x && prof_y){
            let dist = Math.round(get_distance_m(prof_x,prof_y,location_x,location_y))
            // console.log(dist)
            var criteria = config['distanceAverage'].criteria
            var values = config['distanceAverage'].response
            for(let crit of criteria){
                if(dist <= crit){
                    return values[criteria.indexOf(crit)]
                }
            }
            return values[values.length - 1]
        }
        return 0
    },

    monthReviewsFrequency : function(review, profil, location, currentDate) {
        // @TODO
        return 0
    },
    accountCreation : function(review, profil, location, currentDate) {
        // @TODO
        return 0
    },
}

function deg2rad(x){
    return Math.PI*x/180;
}

function get_distance_m($lat1, $lng1, $lat2, $lng2) {
    $earth_radius = 6378137;
    $rlo1 = deg2rad($lng1);
    $rla1 = deg2rad($lat1);
    $rlo2 = deg2rad($lng2);
    $rla2 = deg2rad($lat2);
    $dlo = ($rlo2 - $rlo1) / 2;
    $dla = ($rla2 - $rla1) / 2;
    $a = (Math.sin($dla) * Math.sin($dla)) + Math.cos($rla1) * Math.cos($rla2) * (Math.sin($dlo) * Math.sin($dlo
));
    $d = 2 * Math.atan2(Math.sqrt($a), Math.sqrt(1 - $a));
    return ($earth_radius * $d) / 1000;
}
