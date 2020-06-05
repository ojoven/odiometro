var assert = require('chai').assert;
var expect = require('chai').expect;

describe('tweet store', function () {

	var Tweet = require("../app/models/Tweet.js");

	var path = require('path');
	global.appRoot = path.resolve(__dirname + '/../');
	global.botName = 'odiometro';

	it.skip('should parse the tweet correctly if a simple status', function (done) {

		var twitter = require("../app/lib/twitter.js");

		twitter.getTweet("1264954172312559617", function (tweet) {

			tweet.words = [];
			var tweetStore = Tweet.parseTweetForStore(tweet);
			assert.equal(tweetStore.in_reply_to_status_id_str, null);
			assert.equal(tweetStore.in_reply_to_user_id_str, null);
			assert.equal(tweetStore.in_reply_to_user_screen_name, null);

			assert.equal(tweetStore.quoted_status_id_str, null);
			assert.equal(tweetStore.quoted_status_user_id_str, null);
			assert.equal(tweetStore.quoted_status_user_screen_name, null);
			done();
		});

	});

	it.skip('should parse the tweet correctly if a reply', function (done) {

		var twitter = require("../app/lib/twitter.js");

		twitter.getTweet("1264962183756218368", function (tweet) {

			console.log(tweet);
			tweet.words = [];
			var tweetStore = Tweet.parseTweetForStore(tweet);
			//console.log(tweetStore);
			assert.equal(tweetStore.in_reply_to_status_id_str, "1264954172312559617");
			assert.equal(tweetStore.in_reply_to_user_id_str, "29231749");
			assert.equal(tweetStore.in_reply_to_user_screen_name, "ojoven");

			assert.equal(tweetStore.quoted_status_id_str, null);
			assert.equal(tweetStore.quoted_status_user_id_str, null);
			assert.equal(tweetStore.quoted_status_user_screen_name, null);

			done();
		});

	});

	it.skip('should parse the retweet correctly', function (done) {

		var twitter = require("../app/lib/twitter.js");

		twitter.getTweet("1268466796379725826", function (retweet) {

			var retweetStore = Tweet.parseRetweetForStore(retweet);

			assert.equal(retweetStore.id_str, '1268466796379725826');
			assert.equal(retweetStore.user_id_str, '1256293626990284802');
			assert.equal(retweetStore.user_screen_name, 'RQanom');
			assert.equal(retweetStore.retweeted_status_id_str, '1268463927127617536');

			done();
		});

	});

});