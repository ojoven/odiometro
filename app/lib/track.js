var track = {

	getWords: function () {
		var trackComplete = require(global.appRoot + '/public/track_' + global.lang + '.json');
		var trackWords = JSON.stringify(trackComplete.map(function (wordObject) {
			return wordObject.word;
		}));

		return trackWords;
	}
}

module.exports = track;