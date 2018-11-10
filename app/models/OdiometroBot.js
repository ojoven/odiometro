/** TWEET **/

var OdiometroBot = {
	twitter: null
};

OdiometroBot.initialize = function(twitter) {
	this.twitter = twitter;
};

// Filters //
OdiometroBot.postTweet = function() {

	this.postTweetHateful();

};

OdiometroBot.postTweetHateful = function() {

	database.getMostHatefulUserAndTweet(function(tweet) {

		//var mostHatefulUserTweet = { tweet: tweet.text, id_str: tweet.id_str, screen_name: tweet.user};
		this.twitter.postTweet();

	});

};

OdiometroBot.getTemplateHateful = function() {

	var templates = [
		'Parece que [user] es el usuario que más odio ha generado en las '
	];

};

module.exports = OdiometroBot;

