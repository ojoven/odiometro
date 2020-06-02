/** TWITTER STREAM **/
module.exports = function (twitter) {

	var track = require("../../app/lib/track.js");
	var trackWords = track.getWords();
	console.log(typeof trackWords, trackWords);

	if (global.lang === 'es') {
		twitterStream = twitter.stream('statuses/filter', {
			track: trackWords,
			language: 'es'
		});
	} else {
		twitterStream = twitter.stream('statuses/filter', {
			track: trackWords,
			language: 'en'
		});
	}

	return twitterStream;
};