var assert = require('chai').assert;
var expect = require('chai').expect;

describe('is a hate tweet?', function () {

	var Tweet = require("../app/models/Tweet.js");
	var track = require("../app/lib/track.js");

	var path = require('path');
	global.appRoot = path.resolve(__dirname + '/../');
	global.lang = 'es';

	it('should return true if it includes only bad words facha and fascista', function () {

		var tweet = {
			text: 'Cuando la facha es una fascista'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), true);
	});

	it('should return false if it doesnt include bad words', function () {

		var tweet = {
			text: 'Hola amigo tomamos una cerveza'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), false);
	});

	it('should return false if it includes only not fully hateful word like facha', function () {

		var tweet = {
			text: 'Me llaman facha y lloro'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), false);
	});

	it('should return true if eres un facha', function () {

		var tweet = {
			text: 'Eres un facha'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), true);
	});

	it('should return hate level 1 if eres un facha', function () {

		var tweet = {
			text: 'Eres un facha'
		};

		assert.equal(Tweet.getHateLevelTweet(tweet, track), 1);
	});

	it('should return hate level 1 if eres un indeseable', function () {

		var tweet = {
			text: 'Eres un indeseable'
		};

		assert.equal(Tweet.getHateLevelTweet(tweet, track), 1);
	});

	it('should return hate level 1 if eres un indeseable', function () {

		var tweet = {
			text: 'Eres un indeseable'
		};

		assert.equal(Tweet.getHateLevelTweet(tweet, track), 1);
	});

	it('should return hate level 2 or bigger if indeseable, vete a tomar por culo', function () {

		var tweet = {
			text: 'Indeseable, vete a tomar por culo'
		};

		expect(Tweet.getHateLevelTweet(tweet, track)).to.be.greaterThan(1);
	});

});