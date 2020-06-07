var assert = require('chai').assert;
var expect = require('chai').expect;

describe('is a hate tweet?', function () {

	var Tweet = require("../app/models/Tweet.js");
	var track = require("../app/lib/track.js");

	var path = require('path');
	global.appRoot = path.resolve(__dirname + '/../');
	global.lang = 'es';

	it('should return all different words from track.json', function () {

		var words = track.getWords();
		var existingWords = [];
		words.forEach(function (word) {
			expect(existingWords).not.to.include(word);
			existingWords.push(word);
		})

	});

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

	it('should return false if it includes jajaja', function () {

		var tweet = {
			text: 'Eres un poco gilipollas jajaja'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), false);
	});

	it('should return true if it includes jajaja but still multiple hate expressions', function () {

		var tweet = {
			text: 'Eres un poco gilipollas malnacido jajaja'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), true);
	});

	it('should return false if phrase is jajaja, hoy estoy gilipollas, qué tonto soy xd', function () {

		var tweet = {
			text: 'jajaja, hoy estoy gilipollas, qué tonto soy xd'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), false);
	});

	it('should return true if reply to a user using malfollada', function () {

		var tweet = {
			text: 'vaya con la malfollada',
			in_reply_to_status_id: 292929292
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), true);
	});

	it('should return false if reply to a user using ONLY feminazi', function () {

		var tweet = {
			text: 'vaya con la feminazi',
			in_reply_to_status_id: 292929292
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), false);
	});

	it('should return true if puta feminazi', function () {

		var tweet = {
			text: 'vaya con la puta feminazi'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), true);
	});

	it('should return false if demócrata (it includes the word rata inside it)', function () {

		var tweet = {
			text: 'hay que ser demócrata en la vida'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), false);
	});

	it('should return false if reply @willytolerdoo (has "lerdo" in the name) even with a half weighted word', function () {

		var tweet = {
			text: '@willytolerdoo es un poco indeseable que quieran hacer eso'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), false);
	});

	it('should return true if reply @willytolerdoo with a full hate tweet', function () {

		var tweet = {
			text: '@willytolerdoo eres un indeseable'
		};

		assert.equal(Tweet.isItAHateTweet(tweet, track), true);
	});

	it.skip('should parse the tweet correectly', function (done) {

		var twitter = require("../app/lib/twitter.js");

		twitter.getTweet("1269407699940323328", function (tweet) {

			assert.equal(Tweet.isItAHateTweet(tweet, track), true);

			done();
		});

	});

});