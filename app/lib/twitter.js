/** TWITTER **/
// Twitter streaming
var twitterConfig = require(global.appRoot + '/config/twitter.json');
var fs = require('fs');

var Twit = require('twit');
var twitterObject = new Twit({
	consumer_key: twitterConfig.consumer_key,
	consumer_secret: twitterConfig.consumer_secret,
	access_token: twitterConfig.access_token,
	access_token_secret: twitterConfig.access_token_secret,
	timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
});

twitterObject.postTweet = function (tweet, callback) {

	twitterObject.post('statuses/update', {
		status: tweet
	}, function (err, data, response) {
		callback(data)
	})
}

twitterObject.postTweetWithMedia = function (pathMediaFile, tweet, altText, callback) {

	var b64content = fs.readFileSync(pathMediaFile, {
		encoding: 'base64'
	})

	twitterObject.post('media/upload', {
		media_data: b64content
	}, function (err, data, response) {
		// now we can assign alt text to the media, for use by screen readers and
		// other text-based presentations and interpreters
		var mediaIdStr = data.media_id_string
		var meta_params = {
			media_id: mediaIdStr,
			alt_text: {
				text: altText
			}
		}

		twitterObject.post('media/metadata/create', meta_params, function (err, data, response) {
			if (!err) {
				// now we can reference the media and post a tweet (media will attach to the tweet)
				var params = {
					status: tweet,
					media_ids: [mediaIdStr]
				}

				twitterObject.post('statuses/update', params, function (err, data, response) {
					callback(data)
				})
			}
		})
	})
}

twitterObject.postTweetAsReplyTo = function (tweet, id_str, callback) {

	twitterObject.post('statuses/update', {
		status: tweet,
		in_reply_to_status_id: '' + id_str
	}, function (err, data, response) {
		callback(data)
	})
}

twitterObject.getTweet = function (id_str, callback) {

	twitterObject.get('statuses/show/:id', {
		id: id_str
	}, function (err, data, response) {
		callback(data)
	})
}

module.exports = twitterObject;