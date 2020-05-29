var track = {

	getWords: function () {
		var trackComplete = this.getWordsWithWeights();
		var trackWords = trackComplete.map(function (wordObject) {
			return wordObject.word;
		});

		return trackWords;
	},

	getWordsWithWeights: function () {
		var trackComplete = require(global.appRoot + '/public/track_' + global.lang + '.json');
		return trackComplete;
	}
}

module.exports = track;