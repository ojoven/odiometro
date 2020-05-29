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
			console.log(word.word, word.weight);
			totalHateTweet = totalHateTweet + parseFloat(word.weight);
		}
	});

	// Convert 0.5 or whatever to 1 if it includes previous "eres un..."
	var directedHateExpresions = ['eres un', 'eres una', 'eres', 'sois', 'sois unas', 'sois unos', 'pedazo', 'pedazo de']
	wordsWithWeights.forEach(function (word) {

		directedHateExpresions.forEach(function (directedHateExpresion) {
			if (tweetTextLowercase.includes(directedHateExpresion + ' ' + word.word)) {
				totalHateTweet = totalHateTweet + 1 - parseFloat(word.weight);
			}
		});
	});

	var t1 = new Date().getTime()
	console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
	return totalHateTweet
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