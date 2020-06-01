var assert = require('chai').assert;
var expect = require('chai').expect;

describe('tweet store', function () {

	var Tweet = require("../app/models/Tweet.js");

	var path = require('path');
	global.appRoot = path.resolve(__dirname + '/../');
	global.lang = 'es';

	it.skip('should parse the tweet correctly if a simple status', function () {

		var twitter = require("../app/lib/twitter.js");

		twitter.getTweet("1264954172312559617", function (tweet) {

			var tweetStore = Tweet.parseTweetForStore(tweet);
			assert.equal(tweetStore.in_reply_to_status_id_str, null);
			assert.equal(tweetStore.in_reply_to_user_id_str, null);
			assert.equal(tweetStore.in_reply_to_user_screen_name, null);

			assert.equal(tweetStore.quoted_status_id_str, null);
			assert.equal(tweetStore.quoted_status_user_id_str, null);
			assert.equal(tweetStore.quoted_status_user_screen_name, null);
		});

	});

	it('should parse the tweet correctly if a reply', function () {

		var twitter = require("../app/lib/twitter.js");

		twitter.getTweet("1264962183756218368", function (tweet) {

			var tweetStore = Tweet.parseTweetForStore(tweet);
			console.log(tweetStore);
			assert.equal(tweetStore.in_reply_to_status_id_str, "1264954172312559617");
			assert.equal(tweetStore.in_reply_to_user_id_str, "29231749");
			assert.equal(tweetStore.in_reply_to_user_screen_name, "ojoven");

			assert.equal(tweetStore.quoted_status_id_str, null);
			assert.equal(tweetStore.quoted_status_user_id_str, null);
			assert.equal(tweetStore.quoted_status_user_screen_name, null);
		});

	});

});