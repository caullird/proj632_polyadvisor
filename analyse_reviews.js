var sentiment = require('multilang-sentiment')
const fetch  = require("node-fetch")
const fs = require('fs')

let url_locations = "results/7623373/1615188100309/data/location.json"


// Récupération du fichier JSON pour les informations du restaurants
let rawdata_locations = fs.readFileSync(url_locations)
let locations = JSON.parse(rawdata_locations)


// Récupération de l'ensemble des reviews
let location_id = locations['data']['locations'][0]['locationId']
var reviews = locations['data']['locations'][0]['reviewList']['reviews']


reviews.forEach(obj => {
	// Création du tableau contenant l'ensemble des résultats d'analyses
	var data = []

	// Analyse de l'avis courant 
	console.log(sentiment_analyse(obj['text']))
	

	// Récupération des données utilisateurs 
	var user_data = get_user_data("results/7623373/1615188100309/profils/" + obj['userId'])
	if(typeof user_data === 'undefined'){
		console.log("Aucun fichier utilisateur existant | ID Utilisateur " + obj['userId'] + " pour l'avis " + obj['id'])
	}else{
		// console.log(user_data)
	}

	// Création du fichier d'analyse pour chaque avis
	create_json_file_result(obj,data)
})

// -------- Fonction de récupération des données utilisateurs -------- //

function get_user_data(user_id){
	let url_user = user_id + '.json'
	if(fs.existsSync(url_user)){
		return JSON.parse(fs.readFileSync(url_user))
	}
}

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
}