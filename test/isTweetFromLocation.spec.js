var assert = require('chai').assert;
var expect = require('chai').expect;

describe('is a tweet from location?', function () {

	var Tweet = require("../app/models/Tweet.js");
	var nonValidLocations = require("../config/non-valid-locations.json");

	var path = require('path');
	global.appRoot = path.resolve(__dirname + '/../');
	global.lang = 'es';

	it('should return all different words from track.json', function () {

		var existingLocations = [];
		nonValidLocations.forEach(function (location) {
			expect(existingLocations).not.to.include(location);
			existingLocations.push(location);
		})

	});

	it('should return not valid location if users location includes México', function () {

		var tweet = {
			user: {
				location: 'DF, México'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, nonValidLocations), false);
	});

	it('should return not valid location if users location includes Mexico (no tilde)', function () {

		var tweet = {
			user: {
				location: 'DF, Mexico'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, nonValidLocations), false);
	});

	it('should return not valid location if users location includes mexico (no tilde, lowercase)', function () {

		var tweet = {
			user: {
				location: 'DF, mexico'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, nonValidLocations), false);
	});

	it('should return valid location if Madrid, España', function () {

		var tweet = {
			user: {
				location: 'Madrid, España'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, nonValidLocations), true);
	});

	it('should return valid location if location null', function () {

		var tweet = {
			user: {
				location: null
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, nonValidLocations), true);
	});

	it('should return not valid location if retweeted tweets user location is México', function () {

		var tweet = {
			user: {
				location: 'Madrid, España'
			},
			retweeted_status: {
				user: {
					location: 'DF, México'
				}
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, nonValidLocations), false);
	});

	it('should return not valid location if quoted tweets user location is México', function () {

		var tweet = {
			user: {
				location: 'Madrid, España'
			},
			quoted_status: {
				user: {
					location: 'DF, México'
				}
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, nonValidLocations), false);
	});

});