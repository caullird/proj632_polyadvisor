var sentiment = require('multilang-sentiment')
const fetch  = require("node-fetch")
const fs = require('fs')

module.exports = {
  getAnalyzes: function (locationID, currentDate) {
  	analyzeReviews(locationID,currentDate)
    
  },
};

function analyzeReviews(locationID,currentDate){

	// Get location data 
	let url_data_recovery = "./results/" + locationID + "/" + currentDate
	
	let url_location = url_data_recovery + "/data/location.json"

	let location = JSON.parse(fs.readFileSync(url_location))

	data = write_location_data(location,data)

	var reviews = location['data']['locations'][0]['reviewList']['reviews']

	reviews.forEach(review => {

		console.log(sentiment_analyze(review['text'])['score'])

		user_data = get_user_data(review['userId'],url_data_recovery)

		if(typeof user_data === 'undefined'){
			console.log("Aucun fichier utilisateur existant | ID Utilisateur " + obj['userId'] + " pour l'avis " + obj['id'])

		}

		create_json_file_result(locationID,review,data,currentDate)
	})	
}

function get_user_data(user_id,url){
	let url_user = url + "/profils/" + user_id + '.json'

	try{
		return JSON.parse(fs.readFileSync(url_user,"utf8"))
	}catch(error){
		console.error(error)
	}
	
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