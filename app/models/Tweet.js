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

module.exports = Tweet;

