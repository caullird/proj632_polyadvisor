var sentiment = require('multilang-sentiment')
const fetch  = require("node-fetch")
const fs = require('fs')

module.exports = {
  getAnalyzes: function (location, profils, currentDate) {
  	analyzeReviews(location, profils, currentDate)
    
  },
};

function analyzeReviews(location, profils, currentDate){

	console.log(location)

	var reviews = location['reviewList']['reviews']

	reviews.forEach(review => {

		user_data = get_user_data(review['userId'],profils)

	})	
}

function get_user_data(user_id,profils){
	profils.forEach(profil =>{
		if(profil['data']['socialFeed']['sections'][0]['actor']['userId'] == user_id){
			return profil
		}		
	})
}
	

function create_json_file_result(locationID,review,data,current_date){

	fs.mkdirSync('results/'+ locationID +'/'+ current_date +'/analyze/', { recursive: true });

	let url_result_file = 'results/'+ locationID +'/'+ current_date +'/analyze/' + review['id'] + '.json'
	fs.writeFileSync(url_result_file, JSON.stringify(data), 'utf8');
}

function sentiment_analyze(obj){
	return sentiment(obj,'fr')
}

function write_location_data(location,data){

}