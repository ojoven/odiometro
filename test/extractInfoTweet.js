var assert = require('chai').assert;
var expect = require('chai').expect;

describe('hate info tweet', function () {

	var Tweet = require("../app/models/Tweet.js");
	var track = require("../app/lib/track.js");

	var path = require('path');
	global.appRoot = path.resolve(__dirname + '/../');
	global.lang = 'es';

	it('should return eres una zorra as incremental', function () {

		var tweet = {
			text: 'vaya contigo, eres una zorra'
		};

		var info = Tweet.extractInformationFromTweet(tweet, track);
		console.log(info);

		assert.equal(info.words[0].word, 'eres una zorra');
		assert.equal(info.words[0].weight, 1);
	});

	it('should return info for puta feminazi', function () {

		var tweet = {
			text: 'vaya con la puta feminazi'
		};

		var info = Tweet.extractInformationFromTweet(tweet, track);

		assert.equal(info.words[0].word, 'puta feminazi');
		assert.equal(info.words[0].weight, 1);
	});

	it('should return several info for callate ya puto nazi de mierda', function () {

		var tweet = {
			text: 'callate ya puto nazi de mierda'
		};

		var info = Tweet.extractInformationFromTweet(tweet, track);
		console.log(info);

		assert.equal(info.words.length, 3);
	});

});