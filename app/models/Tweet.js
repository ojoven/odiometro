/** TWEET **/

var Tweet = {};

// Filters //
Tweet.isItAHateTweet = function(tweet) {

	return true;
};

Tweet.isItARetweet = function(tweet) {

	return (tweet.retweeted_status !== undefined);

};

module.exports = Tweet;

