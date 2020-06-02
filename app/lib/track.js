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
	}
}

module.exports = track;