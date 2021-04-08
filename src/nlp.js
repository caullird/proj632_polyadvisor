const NlpjsTFr = require('nlp-js-tools-french');
const stopwords = require('stopwords-fr');

module.exports = {
    scan : function(review, currentDate) {
        let config = {
            tagTypes: ['adj'], //["adj", "adv", "art", "con", "nom", "ono", "pre", "ver", "pro"] 
            strictness: false,
            minimumLength: 3,
            debug: true
        }
    
        let nlpToolsFr = new NlpjsTFr(review['text'].toLowerCase(), config);
        let tokenizedWords = nlpToolsFr.tokenized;

        var words = tokenizedWords.filter(function(word) {
            return stopwords.indexOf(word) === -1;
        });

        console.log(words)

        return "wow"
    }
}