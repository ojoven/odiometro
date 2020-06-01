/** TWEET **/

var Tweet = {

	thresholdHateLevel: 1,

};

// Filters //
Tweet.isItAHateTweet = function (tweet, track) {

	var hateLevel = this.getHateLevelTweet(tweet, track);
	return hateLevel >= this.thresholdHateLevel;
};

Tweet.isItAHateTweetFromInformation = function (information) {

	var hateLevel = this.getHateLevelTweetFromInformation(information);
	return hateLevel >= this.thresholdHateLevel;
}

Tweet.extractInformationFromTweet = function (tweet, track) {

	var words = [];
	var filters = [];
	var type = 'status';

	var tweetTextLowercase = tweet.text.toLowerCase();

	// Check word weights
	var wordsWithWeights = track.getWordsWithWeights();
	wordsWithWeights.forEach(function (word) {
		if (tweetTextLowercase.includes(word.word)) {
			words.push(word);
		}
	});

	// Let's filter words that are substrings of others
	words.forEach(function (word1) {
		words.forEach(function (word2) {
			if (word1.word.includes(word2.word) && word1.word !== word2.word) {

				words = words.filter(function (w) {
					return w.word !== word2.word
				});

			}

		});
	});

	// Convert 0.5 or whatever to 1 if it includes previous "eres un..."
	var directedHateExpresions = ['eres un', 'eres una', 'eres', 'sois', 'sois unas',
		'sois unos', 'pedazo', 'pedazo de', 'maldito', 'maldita', 'puto', 'puta', 'perro',
		'el muy', 'la muy', 'los muy', 'las muy'
	];

	wordsWithWeights.forEach(function (word) {

		directedHateExpresions.forEach(function (directedHateExpresion) {
			var directedHateExpressionWithWord = directedHateExpresion + ' ' + word.word;
			if (tweetTextLowercase.includes(directedHateExpressionWithWord)) {

				// Remove word from words (it's now on incrementals)
				words = words.filter(function (w) {
					return w.word !== word.word
				});

				// Add incremental
				words.push({
					word: directedHateExpressionWithWord,
					weight: 1
				});

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
			filters.push(filterExpression);
		}
	});

	// TYPE
	if (tweet.in_reply_to_status_id) {
		type = 'reply';
	}

	var information = {
		words: words,
		filters: filters,
		type: type
	}

	return information;
}

Tweet.getHateLevelTweet = function (tweet, track) {

	var totalHateTweet = 0;

	var information = this.extractInformationFromTweet(tweet, track);
	var totalHateTweet = this.getHateLevelTweetFromInformation(information);

	console.log('Hate level: ' + totalHateTweet);

	return totalHateTweet;
}

Tweet.getHateLevelTweetFromInformation = function (information) {

	var totalHateTweet = 0;

	information.words.forEach(function (word) {
		totalHateTweet += word.weight;
	});

	information.filters.forEach(function () {
		totalHateTweet -= 1;
	});

	if (information.type === 'mention' ||
		information.type === 'reply' ||
		information.type === 'quote') {

		totalHateTweet = totalHateTweet + 0.2;
	}

	return totalHateTweet;
}

Tweet.isItAReply = function (tweet) {
	return (tweet.in_reply_to_status_id !== null);
};

Tweet.isItARetweet = function (tweet) {
	return (tweet.retweeted_status !== undefined);
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