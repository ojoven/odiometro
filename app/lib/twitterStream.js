/** TWITTER STREAM **/
module.exports = function (twitter) {

	var track = require(global.appRoot + '/public/track_' + global.lang + '.json');
	var twitterStream;

	if (global.lang === 'es') {
		twitterStream = twitter.stream('statuses/filter', {
			track: track,
			language: 'es',
			place: 'Spain'
		});
	} else {
		twitterStream = twitter.stream('statuses/filter', {
			track: track,
			language: 'en'
		});
	}

	return twitterStream;
};