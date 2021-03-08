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

/*
let url_locations = "dataReviews.json"


// Récupération du fichier JSON pour les informations du restaurants
let rawdata_locations = fs.readFileSync(url_locations)
let locations = JSON.parse(rawdata_locations)


// Récupération de l'ensemble des reviews
let location_id = locations['data']['locations'][0]['locationId']
var reviews = locations['data']['locations'][0]['reviewList']['reviews']


reviews.forEach(obj => {
	// Création du tableau contenant l'ensemble des résultats d'analyses
	var data = []
	console.log(obj)

	// Analyse de l'avis courant 
	sentiment_analyse(obj['text'])


	// Récupération des données utilisateurs 
	var user_data = get_user_data(obj['userId'])
	if(typeof user_data === 'undefined'){
		console.log("Aucun fichier utilisateur existant | ID Utilisateur " + obj['userId'] + " pour l'avis " + obj['id'])
	}else{
		console.log(user_data)
	}

	// Création du fichier d'analyse pour chaque avis
	create_json_file_result(obj,data)
})

// -------- Fonction de récupération des données utilisateurs -------- //

*

// ------------- Fonctions d'analyse des commentaires ------------- //

function sentiment_analyse(obj){
	return sentiment(obj,'fr')
}



// ---------- Fonctions de génération des fichiers json ---------- //

function create_json_file_result(review,data){
	let current_date = new Date(Date.now()).toLocaleString().split(":").join("-")

	fs.mkdirSync('results/'+ location_id +'/'+ current_date +'/reviews/', { recursive: true });

	let url_result_file = 'results/'+ location_id +'/'+ current_date +'/reviews/' + review['id'] + '.json'
	fs.writeFileSync(url_result_file, data, 'utf8');
}*/