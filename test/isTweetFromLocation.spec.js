var assert = require('chai').assert;
var expect = require('chai').expect;

describe('is a tweet from location?', function () {

	var Tweet = require("../app/models/Tweet.js");

	var path = require('path');
	global.appRoot = path.resolve(__dirname + '/../');
	global.botConfig = require("../config/odiometro.json");

	var ignoreLocations = global.botConfig.ignore_locations;
	var ignoreAccounts = global.botConfig.ignore_accounts;
	var ignoreForeignExpressions = global.botConfig.ignore_foreign_expressions;
	var ignoreUserDescriptions = global.botConfig.ignore_user_descriptions;

	it('should return all different words from track.json', function () {

		var existingLocations = [];
		ignoreLocations.forEach(function (location) {
			expect(existingLocations).not.to.include(location);
			existingLocations.push(location);
		})

	});

	it('should return not valid location if users location includes México', function () {

		var tweet = {
			text: 'Something',
			user: {
				location: 'DF, México',
				screen_name: 'odiometrobot'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), false);
	});

	it('should return not valid location if users location includes Mexico (no tilde)', function () {

		var tweet = {
			text: 'Something',
			user: {
				location: 'DF, Mexico',
				screen_name: 'odiometrobot'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), false);
	});

	it('should return not valid location if users location includes mexico (no tilde, lowercase)', function () {

		var tweet = {
			text: 'Something',
			user: {
				location: 'DF, mexico',
				screen_name: 'odiometrobot'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), false);
	});

	it('should return valid location if Madrid, España', function () {

		var tweet = {
			text: 'Something',
			user: {
				location: 'Madrid, España',
				screen_name: 'odiometrobot'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), true);
	});

	it('should return valid location if location null', function () {

		var tweet = {
			text: 'Something',
			user: {
				location: null,
				screen_name: 'odiometrobot'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), true);
	});

	it('should return not valid location if retweeted tweets user location is México', function () {

		var tweet = {
			text: 'Something',
			user: {
				location: 'Madrid, España',
				screen_name: 'odiometrobot'
			},
			retweeted_status: {
				user: {
					location: 'DF, México',
					screen_name: 'odiometrobot'
				}
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), false);
	});

	it('should return not valid location if quoted tweets user location is México', function () {

		var tweet = {
			text: 'Something',
			user: {
				location: 'Madrid, España',
				screen_name: 'odiometrobot'
			},
			quoted_status: {
				user: {
					location: 'DF, México',
					screen_name: 'odiometrobot'
				}
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), false);
	});

	it('should return not valid location if mentions vaina', function () {

		var tweet = {
			text: 'Menuda vaina el hijoputa este weon',
			user: {
				location: null,
				screen_name: 'odiometrobot'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), false);
	});

	it('should return not valid location if mentions @NicolasMaduro', function () {

		var tweet = {
			text: 'El @NicolasMaduro este es un hijoputa',
			user: {
				location: null,
				screen_name: 'odiometrobot'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), false);
	});

	it('should return not valid location if is a tweet from @NicolasMaduro', function () {

		var tweet = {
			text: 'El chavo este es un hijoputa',
			user: {
				screen_name: 'NicolasMaduro'
			}
		};

		assert.equal(Tweet.isValidLocation(tweet, ignoreLocations, ignoreAccounts, ignoreForeignExpressions, ignoreUserDescriptions), false);
	});

});