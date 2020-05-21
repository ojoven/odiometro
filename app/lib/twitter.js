/** TWITTER **/
// Twitter streaming
var twitterConfig = require(global.appRoot + '/config/twitter.json');

var Twit = require('twit');
var twitterObject = new Twit({
	consumer_key: twitterConfig.consumer_key,
	consumer_secret: twitterConfig.consumer_secret,
	access_token: twitterConfig.access_token,
	access_token_secret: twitterConfig.access_token_secret,
	timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
});

twitterObject.postTweet = function (tweet) {

	twitterObject.post('statuses/update', {
		status: tweet
	}, function (err, data, response) {
		console.log(data)
	})
}

twitterObject.postTweetAsReplyTo = function (tweet, id_str) {

	twitterObject.post('statuses/update', {
		status: tweet,
		in_reply_to_status_id: '' + id_str
	}, function (err, data, response) {
		console.log(data)
	})
}

module.exports = twitterObject;