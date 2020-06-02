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
	var hatePrefixes = global.botConfig.hate_prefixes;

	wordsWithWeights.forEach(function (word) {

		hatePrefixes.forEach(function (hatePrefix) {
			var hatePrefixWithWord = hatePrefix + ' ' + word.word;
			if (tweetTextLowercase.includes(hatePrefixWithWord)) {

				// Remove word from words (it's now on incrementals)
				words = words.filter(function (w) {
					return w.word !== word.word
				});

				// Add incremental
				words.push({
					word: hatePrefixWithWord,
					weight: 1
				});

			}
		});
	});

	// Filter tweets that include words, expressions and emojis that may denote comical attitude or referring to themself (soy gilipollas)
	var comicalExpressions = global.botConfig.ignore_expressions.comical;
	var selfRelatedExpressions = global.botConfig.ignore_expressions.self;
	var specificDeactivators = global.botConfig.ignore_expressions.specific;

	var filterExpressions = comicalExpressions.concat(selfRelatedExpressions, specificDeactivators);

	filterExpressions.forEach(function (filterExpression) {
		if (tweetTextLowercase.includes(filterExpression)) {
			filters.push(filterExpression);
		}
	});

	// TYPE
	if (tweet.in_reply_to_status_id) {
		type = 'reply';
	} else if (tweet.quoted_status) {
		type = 'quote';
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

Tweet.isItAQuote = function (tweet) {
	return tweet.is_quote_status;
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

Tweet.parseTweetForStore = function (tweet) {

	tweetStore = {
		id_str: tweet.id_str,
		text: tweet.text,

		in_reply_to_status_id_str: tweet.in_reply_to_status_id_str,
		in_reply_to_user_id_str: tweet.in_reply_to_user_id_str,
		in_reply_to_user_screen_name: tweet.in_reply_to_user_id_str ? tweet.in_reply_to_screen_name : null,

		quoted_status_id_str: tweet.is_quote_status ? tweet.quoted_status_id_str : null,
		quoted_status_user_id_str: tweet.is_quote_status ? tweet.quoted_status.user.id_str : null,
		quoted_status_user_screen_name: tweet.is_quote_status ? tweet.quoted_status.user.screen_name : null,

		user_id_str: tweet.user.id_str,
		user_screen_name: tweet.user.screen_name,
		user_followers_count: tweet.user.followers_count,
		user_friends_count: tweet.user.friends_count,
		user_statuses_count: tweet.user.statuses_count,
		user_profile_image_url_https: tweet.user.profile_image_url_https,

		created_at: tweet.created_at
	}

	return tweetStore;
}

Tweet.isValidLocation = function (tweet, ignoreLocations) {

	var isValidLocation = true;
	var userLocation = tweet.user.location ? tweet.user.location.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;
	var retweetedUserLocation = tweet.retweeted_status && tweet.retweeted_status.user.location ? tweet.retweeted_status.user.location.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;
	var quotedUserLocation = tweet.quoted_status && tweet.quoted_status.user.location ? tweet.quoted_status.user.location.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : null;

	ignoreLocations.forEach(function (location) {

		location = location.toLowerCase();

		// If user's location
		if (userLocation && userLocation.includes(location)) {
			isValidLocation = false;
		}

		// If retweeted user's location
		if (retweetedUserLocation && retweetedUserLocation.includes(location)) {
			isValidLocation = false;
		}

		// If quoted user's location
		if (quotedUserLocation && quotedUserLocation.includes(location)) {
			isValidLocation = false;
		}
	});

	return isValidLocation;

}

Tweet.getText = function (tweet) {

	if (Tweet.isItARetweet(tweet)) {
		tweetText = tweet.retweeted_status.truncated ? tweet.retweeted_status.extended_tweet.text : tweet.retweeted_status.text;
	} else {
		tweetText = tweet.truncated ? tweet.extended_tweet.text : tweet.text;
	}
}

module.exports = Tweet;