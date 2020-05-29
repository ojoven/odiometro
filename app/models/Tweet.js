/** TWEET **/

var Tweet = {

	thresholdHateLevel: 1,

};

// Filters //
Tweet.isItAHateTweet = function (tweet, track) {

	var hateLevel = this.getHateLevelTweet(tweet, track);

	return hateLevel >= this.thresholdHateLevel;
};

Tweet.getHateLevelTweet = function (tweet, track) {

	var t0 = new Date().getTime()
	var totalHateTweet = 0;

	var tweetTextLowercase = tweet.text.toLowerCase();

	// Check word weights
	var wordsWithWeights = track.getWordsWithWeights();
	wordsWithWeights.forEach(function (word) {
		if (tweetTextLowercase.includes(word.word)) {
			totalHateTweet = totalHateTweet + parseFloat(word.weight);
		}
	});

	// Convert 0.5 or whatever to 1 if it includes previous "eres un..."
	var directedHateExpresions = ['eres un', 'eres una', 'eres', 'sois', 'sois unas',
		'sois unos', 'pedazo', 'pedazo de', 'maldito', 'maldita', 'puto', 'puta', 'perro',
		'el muy', 'la muy', 'los muy', 'las muy'
	];

	wordsWithWeights.forEach(function (word) {

		directedHateExpresions.forEach(function (directedHateExpresion) {
			if (tweetTextLowercase.includes(directedHateExpresion + ' ' + word.word)) {
				totalHateTweet = totalHateTweet + 1 - parseFloat(word.weight);
			}
		});
	});

	// Filter tweets that include words, expressions and emojis that may denote comical attitude or referring to themself (soy gilipollas)
	var comicalExpressions = ['jaja', 'haha', 'jeje', 'hehe', 'jiji', 'lol', 'de puta madre', 'xd', 'equisde'];
	var selfRelatedExpressions = ['soy', 'estoy', 'me pasa'];
	var specificDeactivators = ['querella criminal', 'han retrasado', 'hemos retrasado', 'he retrasado', 'habeis retrasado', 'has retrasado', 'ha retrasado'];

	var filterExpressions = comicalExpressions.concat(selfRelatedExpressions, specificDeactivators);

	filterExpressions.forEach(function (filterExpression) {
		if (tweetTextLowercase.includes(filterExpression)) {
			totalHateTweet = totalHateTweet - 1;
		}
	});

	var t1 = new Date().getTime()
	console.log("Time to parse the tweet: " + (t1 - t0) + " milliseconds.")
	console.log('Hate level: ' + totalHateTweet);

	return totalHateTweet;
}

Tweet.isItAReply = function (tweet) {
	return (tweet.retweeted_status !== undefined);
};

Tweet.isItARetweet = function (tweet) {
	return (tweet.retweeted_status !== undefined);
};

Tweet.isItATweetToBeShown = function (tweet, track) {

	var tweetText = tweet.text.toLowerCase();

	for (var i in track) {
		var keywords = track[i].split(' ');
		var allKeywordsMatch = true;
		for (var j in keywords) {
			if (tweetText.indexOf(keywords[j].toLowerCase()) === -1) {
				allKeywordsMatch = false;
			}
		}
		if (allKeywordsMatch) {
			return true;
		}
	}

	return false;
};

// GET USERS
Tweet.getUsernamesInTweet = function (tweetText) {

	var userNamesInTweet = tweetText.match(/@\w+/g);
	return userNamesInTweet;

};

Tweet.isTweetForMostHatedUser = function (tweet, user) {

	if (!user) return false;

	var tweetText = tweet.text.toLowerCase();
	if (tweetText.indexOf(user.toLowerCase()) !== -1) {
		return true;
	}

	return false;
};

Tweet.postTweet = function (tweetText, callback) {

	twitter.post('statuses/update', {

		status: tweetText

	}, function (err, data, response) {

		callback(data);
	});
};

module.exports = Tweet;