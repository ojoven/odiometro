/** TWITTER STREAM **/
module.exports = function (twitter) {

	var track = require("../../app/lib/track.js");
	var trackWords = track.getWords();
	console.log(typeof trackWords, trackWords);

	twitterStream = twitter.stream('statuses/filter', {
		track: trackWords,
		language: global.botConfig.language
	});

	return twitterStream;
};