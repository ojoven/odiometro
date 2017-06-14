/** TWITTER **/
// Twitter streaming
var twitterConfig = require(global.appRoot + '/config/twitter.json');

var Twit = require('twit');
var twitterObject = new Twit({
	consumer_key:         twitterConfig.consumer_key,
	consumer_secret:      twitterConfig.consumer_secret,
	access_token:         twitterConfig.access_token,
	access_token_secret:  twitterConfig.access_token_secret,
	timeout_ms:           60*1000  // optional HTTP request timeout to apply to all requests.
});

var track = require(global.appRoot + '/public/track.json');
var twitterStream = twitterObject.stream('statuses/filter', { track: track, language: 'es', place: 'Spain' });

module.exports = twitterStream;