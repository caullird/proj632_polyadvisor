const { worker } = require('cluster');
const fs = require('fs');
const tools = require('./tools.js')

module.exports = {
    getFrom: function(locationID, location, current_date) {

        let reviews = location['reviewList']['reviews']
        let wordsCloud = {}

        reviews.forEach(review => {
            review.text = review.text
                .toLowerCase()
                .replace(/[`~!@#$%^&*()_|+\-=?;:'"’,.<>\n\{\}\[\]\\\/]/gi, ' ')
                .replace(/[àáâãäå]/g,"a")
                .replace(/[èéêë]/g,"e")
                .replace(/[ôö]/g,"o")
                .split(" ")

            review.text.forEach(word => {
                if (word.length > 2) {
                    if (word in wordsCloud)
                        wordsCloud[word] += 1
                    else
                        wordsCloud[word] = 1
                }
            })
        })

        let wordsCloudArray = Object.keys(wordsCloud).map(function(key) {
            return [key, wordsCloud[key]];
        });

        wordsCloudArray.sort(function(word, amount) {
            return amount[1] - word[1];
        });

        wordsCloud = wordsCloudArray.map(function(item) {
            word = {}
            word[item[0]] = item[1]
            return word;
        });

        path = 'results/'+ locationID +'/'+ current_date +'/analyze/wordsCloud.json'
        tools.writeFile(path, wordsCloud)
        
    }
}