/** DATABASE **/
var dbConfig = require(global.appRoot + '/config/database_' + global.botName + '.json');
var mysql = require('mysql');
var Tweet = require("../models/Tweet.js");

// DB helper
var databaseName = process.env.APP_DATABASE_NAME || dbConfig.database || 'odiometro';
var numTweetsToSave = 5;
var numRetweetsToSave = 10;
var numTweetsToStore = 50;
var tweetsToSave = [];
var retweetsToSave = [];
var tweetsToStore = [];

var database = {
	pool: mysql.createPool({
		connectionLimit : 15,
		// fallback chain for the database config
		//	- prefer environment variables, when running on docker (see docker-compose.yml)
		//  - precedence is given to local config file, if present under config/ folder
		host: process.env.APP_DATABASE_HOST || dbConfig.host,
		user: process.env.APP_DATABASE_USER || dbConfig.user,
		password: process.env.APP_DATABASE_PASSWORD || dbConfig.password,
		database: databaseName,
		charset: process.env.APP_DATABASE_CONNECTION_CHARSET || dbConfig.charset || 'utf8mb4'
	})
};

database.initialize = function () {
};

/** TWEETS **/
database.saveTweet = function (tweet) {

	var that = this;

	tweetsToSave.push(tweet);

	// Is it moment to save tweet?
	if (tweetsToSave.length >= numTweetsToSave) {
		var values = '';
		tweetsToSave.forEach(function (tweet, index) {
			var tweetText = that.escapeSingleQuotes(tweet.text);
			values += '(null, \'' + tweetText + '\', \'' + tweet.id_str + '\', \'' + tweet.user.screen_name + '\', \'{}\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')';
			if (index !== tweetsToSave.length - 1) values += ',';
		});

		tweetsToSave = [];

		var query = 'INSERT INTO ' + databaseName + '.tweets VALUES' + values;
		console.log('Save last ' + numTweetsToSave + ' tweets');

		this.pool.query(query, function (error, results, fields) {
			if (error) {
				console.log(error);
				throw error;
			}
		});
	}

};

// RETWEETS
database.saveRetweet = function (tweet) {

	var that = this;

	retweetsToSave.push(tweet);

	// Is it moment to save retweet?
	if (retweetsToSave.length >= numRetweetsToSave) {
		var values = '';
		retweetsToSave.forEach(function (tweet, index) {
			var retweetText = that.escapeSingleQuotes(tweet.retweeted_status.text);
			values += '(null, \'' + tweet.retweeted_status.id_str + '\', \'' + tweet.retweeted_status.user.screen_name + '\', \'' + retweetText + '\', \'{}\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')';
			if (index !== retweetsToSave.length - 1) values += ',';
		});

		retweetsToSave = [];

		var query = 'INSERT INTO ' + databaseName + '.retweets VALUES' + values;
		console.log('Save last ' + numRetweetsToSave + ' retweets');

		this.pool.query(query, function (error, results, fields) {
			if (error) {
				console.log(error);
				throw error;
			}
		});
	}

};

// GET
database.getNumberOfTweetsInLastMinute = function (callback) {

	var that = this;
	var numberOfTweets = 0;
	var timeInMinutes = 1;
	var dateMysql = this.getDateTimeInMySQLFormatXMinutesAgo(timeInMinutes);
	that.pool.query('SELECT COUNT(*) AS count FROM tweets WHERE published >= \'' + dateMysql + '\'', function (error, results, fields) {

		if (results !== undefined) {
			numberOfTweets = results[0].count;
			that.pool.query('SELECT COUNT(*) AS count FROM retweets WHERE published >= \'' + dateMysql + '\'', function (error, results, fields) {

				numberOfTweets += results[0].count;
				callback(numberOfTweets);
			});
		} else {
			callback(numberOfTweets);
		}

	});

};

database.getLastTweetFromDatabase = function (callback) {

	var query = 'SELECT * FROM ' + databaseName + '.tweets ORDER BY published DESC LIMIT 0,1';
	this.pool.query(query, function (error, results, fields) {
		var lastTweet = results[0];
		callback(lastTweet);
	});
};

// REMOVE
database.cleanOldData = function (timeInMinutes) {

	// Get date for X minutes ago
	var dateMysql = this.getDateTimeInMySQLFormatXMinutesAgo(timeInMinutes);

	// Clean old data from the different tables
	this.pool.query('DELETE FROM ' + databaseName + '.tweets WHERE published < \'' + dateMysql + '\'');
	this.pool.query('DELETE FROM ' + databaseName + '.retweets WHERE published < \'' + dateMysql + '\'');
	this.pool.query('DELETE FROM ' + databaseName + '.users WHERE published < \'' + dateMysql + '\'');

};

database.saveTweetStore = function (tweet) {

	var that = this;

	tweetsToStore.push(tweet);

	// Is it moment to save tweet?
	if (tweetsToStore.length >= numTweetsToStore) {
		var values = '';
		tweetsToStore.forEach(function (tweet, index) {

			var tweetStore = Tweet.parseTweetForStore(tweet);

			var in_reply_to_status_id_str = tweetStore.in_reply_to_status_id_str ? '\'' + tweetStore.in_reply_to_status_id_str + '\'' : null;
			var in_reply_to_user_id_str = tweetStore.in_reply_to_user_id_str ? '\'' + tweetStore.in_reply_to_user_id_str + '\'' : null;
			var in_reply_to_user_screen_name = tweetStore.in_reply_to_user_screen_name ? '\'' + tweetStore.in_reply_to_user_screen_name + '\'' : null;

			var quoted_status_id_str = tweetStore.quoted_status_id_str ? '\'' + tweetStore.quoted_status_id_str + '\'' : null;
			var quoted_status_user_id_str = tweetStore.quoted_status_user_id_str ? '\'' + tweetStore.quoted_status_user_id_str + '\'' : null;
			var quoted_status_user_screen_name = tweetStore.quoted_status_user_screen_name ? '\'' + tweetStore.quoted_status_user_screen_name + '\'' : null;

			values += '(null, ' +
				'\'' + tweetStore.id_str + '\', ' +
				'\'' + that.escapeSingleQuotes(tweetStore.text) + '\', ' +
				'\'' + tweetStore.words + '\', ' +
				in_reply_to_status_id_str + ', ' +
				in_reply_to_user_id_str + ', ' +
				in_reply_to_user_screen_name + ', ' +
				quoted_status_id_str + ', ' +
				quoted_status_user_id_str + ', ' +
				quoted_status_user_screen_name + ', ' +
				'\'' + tweetStore.user_id_str + '\', ' +
				'\'' + tweetStore.user_screen_name + '\', ' +
				tweetStore.user_followers_count + ', ' +
				tweetStore.user_friends_count + ', ' +
				tweetStore.user_statuses_count + ', ' +
				'\'' + tweetStore.user_profile_image_url_https + '\', ' +
				'\'' + tweetStore.created_at + '\', ' +
				'\'' + database.currentDateTimeInMySQLFormat() + '\'' +
				')';

			if (index !== tweetsToStore.length - 1) values += ',';

		});

		tweetsToStore = [];

		var query = 'INSERT INTO ' + databaseName + '.tweets_store VALUES' + values;
		this.pool.query(query);

		console.log('Store last ' + numTweetsToStore + ' tweets');
	}

}

database.saveRetweetStore = function (retweet) {

	var retweetStore = Tweet.parseRetweetForStore(retweet);

	var query = 'INSERT INTO ' + databaseName + '.retweets_store VALUES(null, ' +
		'\'' + retweetStore.id_str + '\', ' +
		'\'' + retweetStore.user_id_str + '\', ' +
		'\'' + retweetStore.user_screen_name + '\', ' +
		'\'' + retweetStore.retweeted_status_id_str + '\', ' +
		'\'' + database.currentDateTimeInMySQLFormat() + '\'' +
		')';

	this.pool.query(query);
}

/** USERS **/
database.saveUsers = function (users) {

	if (!users) return;

	var that = this;
	users.forEach(function (user) {
		that.pool.query('INSERT INTO ' + databaseName + '.users VALUES(null, \'' + user + '\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')');
	});

};

/** USER IMAGES **/
database.getUserImage = function (user, callback) {

	var query = 'SELECT * FROM `user_images` WHERE screen_name = \'' + user + '\'';
	this.pool.query(query, function (error, results, fields) {

		if (!results) {
			callback(false);
		} else {
			var user = results[0];
			callback(user);
		}
	});
}

database.saveUserImage = function (user, userImage) {

	if (!user || !userImage) return;

	this.pool.query('INSERT INTO ' + databaseName + '.user_images VALUES(null, \'' + user + '\', \'' + userImage + '\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')');

};

database.getMostHatedUser = function (callback) {

	var timeInMinutes = 1;
	var dateMysql = this.getDateTimeInMySQLFormatXMinutesAgo(timeInMinutes);
	var query = 'SELECT `user`, COUNT(`user`) AS `user_occurrence` FROM `users` WHERE published > \'' + dateMysql + '\' GROUP BY `user` ORDER BY `user_occurrence` DESC LIMIT 1';
	this.pool.query(query, function (error, results, fields) {

		if (!results) {
			callback(false);
		} else {
			var user = results[0];
			callback(user);
		}
	});
};

database.getMostHatedUserExampleMultipleTweets = function (user, callback) {

	var that = this;

	// FIRST WE RETRIEVE THE EXAMPLE FROM SIMPLE TWEETS
	var query = 'SELECT * FROM `tweets_store` WHERE text LIKE \'%' + user + '%\' ORDER BY `published` DESC LIMIT 10';
	this.pool.query(query, function (error, results, fields) {

		if (results) {

			var tweets = results;
			callback(tweets);

		} else {

			callback(false);

		}
	});
};

database.getMostHatedUserExampleTweet = function (user, callback) {

	var that = this;

	// FIRST WE RETRIEVE THE EXAMPLE FROM SIMPLE TWEETS
	var query = 'SELECT * FROM `tweets` WHERE tweet LIKE \'%' + user + '%\' ORDER BY `published` DESC LIMIT 1';
	this.pool.query(query, function (error, results, fields) {

		if (results) {

			var tweet = results[0];
			callback(tweet);

		} else {

			// IF NO RESULTS WITH TWEETS, WE SEARCH ON RETWEETS
			var query = 'SELECT * FROM `retweets` WHERE retweeted_text LIKE \'%' + user + '%\' ORDER BY `published` DESC LIMIT 1';
			that.pool.query(query, function (error, results, fields) {

				if (results) {
					var tweet = results[0];
					callback(tweet);
				} else {
					callback(false);
				}

			});

		}
	});
};

database.getMostHatefulUserAndTweet = function (callback) {

	var timeInMinutes = 1;
	var dateMysql = this.getDateTimeInMySQLFormatXMinutesAgo(2);
	var that = this;

	// FIRST WE SEARCH FOR THE HATEFUL USER ON RETWEETS, AS IT'S ON THEM WHERE THE INFLUENCE HAPPENS
	var query = 'SELECT `retweeted_user` AS `user`, `retweeted_id` AS `id_str`, `retweeted_text` AS `text`, COUNT(`id`) AS `user_occurrence` FROM `retweets` WHERE retweeted_text LIKE \'%@%\' AND published > \'' + dateMysql + '\' GROUP BY `retweeted_user` ORDER BY `user_occurrence` DESC LIMIT 1';
	that.pool.query(query, function (error, results, fields) {

		if (results) {
			var user = results[0];
			callback(user);

		} else {

			// IF NO RETWEETS WITH HATE, WE SEARCH ON SIMPLE TWEETS
			var query = 'SELECT `screen_name` AS `user`, `id_str`, `tweet` AS `text`, COUNT(`id`) AS `user_occurrence` FROM `tweets` WHERE tweet LIKE \'%@%\' AND published > \'' + dateMysql + '\' GROUP BY `screen_name` ORDER BY `user_occurrence` DESC LIMIT 1';
			that.pool.query(query, function (error, results, fields) {

				if (results) {
					var user = results[0];
					callback(user);
				} else {
					callback(false);
				}
			});
		}
	});
};

/** HISTORIC **/
database.getHistoricData = function (dateStart, dateEnd, callback) {

	var query = 'SELECT `id`, `number_tweets`, `hated_user`, `hated_user_example_tweet_text`, `hated_user_example_tweet_id`, `hated_user_example_tweet_user`, ' +
		'`hateful_user`, `hateful_user_tweet_text`, `hateful_user_tweet_id`, `date`' +
		'FROM `historic` WHERE date >= \'' + dateStart + '\' AND date <= \'' + dateEnd + '\' ORDER BY `date` ASC';

	this.pool.query(query, function (error, results, fields) {

		callback(results);
	});

};

database.getHistoricNumberTweets = function (callback) {

	var limit = 43200; // 30 days of historic data

	var query = 'SELECT `id`, `number_tweets`, `date`' +
		'FROM `historic` ORDER BY `date` DESC LIMIT 0, ' + limit;
	this.pool.query(query, function (error, results, fields) {

		callback(results);
	});

};

database.saveHistoricData = function (
	numberTweets,
	hatedUser, hatedUserExampleTweetText, hatedUserExampleTweetId, hatedUserExampleTweetUser,
	hatefulUser, hatefulUserTweetText, hatefulUserTweetId) {

	hatedUserExampleTweetText = this.escapeSingleQuotes(hatedUserExampleTweetText);
	hatefulUserTweetText = this.escapeSingleQuotes(hatefulUserTweetText);

	this.pool.query(
		'INSERT INTO ' + databaseName + '.historic VALUES(null, \'' + numberTweets + '\', \'' +
		hatedUser + '\', \'' + hatedUserExampleTweetText + '\', \'' + hatedUserExampleTweetId + '\', \'' + hatedUserExampleTweetUser + '\', \'' +
		hatefulUser + '\', \'' + hatefulUserTweetText + '\', \'' + hatefulUserTweetId +
		'\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')',

		function (error, results, fields) {
			if (error) {
				console.log(error);
				throw error;
			}
		});

};

// AUXILIAR
database.currentDateTimeInMySQLFormat = function () {
	return new Date().toISOString().slice(0, 19).replace('T', ' ');
};

database.getDateTimeInMySQLFormatXMinutesAgo = function (timeInMinutes) {

	var date = new Date();
	date.setMinutes(date.getMinutes() - timeInMinutes);
	var dateMysql = date.toISOString().slice(0, 19).replace('T', ' ');
	return dateMysql;
};

database.escapeSingleQuotes = function (string) {

	string = string.split("'").join("\\\'");
	return string;
};

database.escapeDoubleQuotes = function (string) {

	string = string.split('"').join('\\\"');
	return string;
};

module.exports = database;