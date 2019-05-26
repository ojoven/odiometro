/** TWEET **/

var Tweet = {};

// Filters //
Tweet.isItAHateTweet = function(tweet) {

	var tweetTextLowercase = tweet.text.toLowerCase();

	// Ignore tweets containing "jaja" and "jeje", as they'll probably
	// will be humoristic, not hateful tweets
	if (tweetTextLowercase.indexOf('jaja') !== -1 || tweetTextLowercase.indexOf('jeje') !== -1) return false;

	// Let's ignore tweets that include the first person of the verb to be
	// We'll be ignoring tweets like "Soy idiota" "Estoy gilipollas"
	if (tweetTextLowercase.indexOf('soy') !== -1 || tweetTextLowercase.indexOf('estoy') !== -1) return false;

	return true;
};

Tweet.isItARetweet = function(tweet) {

	return (tweet.retweeted_status !== undefined);

};

Tweet.isItATweetToBeShown = function(tweet, track) {

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
Tweet.getUsernamesInTweet = function(tweetText) {

	var userNamesInTweet = tweetText.match(/@\w+/g);
	return userNamesInTweet;

};

Tweet.isTweetForMostHatedUser = function(tweet, user) {

	if (!user) return false;

	var tweetText = tweet.text.toLowerCase();
	if (tweetText.indexOf(user.toLowerCase()) !== -1) {
		return true;
	}

	return false;
};

Tweet.postTweet = function(tweetText, callback) {

	twitter.post('statuses/update', {

		status: tweetText

	}, function(err, data, response) {

			callback(data);
	});
};

module.exports = Tweet;

