var track = {

	getWords: function () {
		var trackComplete = this.getWordsWithWeights();
		var trackWords = trackComplete.map(function (wordObject) {
			return wordObject.word;
		});

		return trackWords;
	},

	getWordsWithWeights: function () {
		var trackComplete = global.botConfig.track;
		return trackComplete;
	},

	getWordsString: function () {
		var trackComplete = this.getWordsWithWeights();
		var trackWords = trackComplete.map(function (wordObject) {
			return wordObject.word;
		});

		trackWordsString = trackWords.join(',');

		return trackWordsString;
	}
}

module.exports = track;