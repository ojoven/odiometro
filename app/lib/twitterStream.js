/** TWITTER STREAM **/
module.exports = function (twitter) {

	var track = require("../../app/lib/track.js");
	var twitterStream;
	console.log(track.getWords());

	if (global.lang === 'es') {
		twitterStream = twitter.stream('statuses/filter', {
			track: track.getWords(),
			language: 'es',
			place: 'Spain'
		});
	} else {
		twitterStream = twitter.stream('statuses/filter', {
			track: track.getWords(),
			language: 'en'
		});
	}

	return twitterStream;
};