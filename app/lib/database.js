/** DATABASE **/
var dbConfig = require(global.appRoot + '/config/database_' + global.lang + '.json');
var mysql = require('mysql');

var database = {
	connection: mysql.createConnection({
		host: dbConfig.host,
		user: dbConfig.user,
		password: dbConfig.password,
		database: dbConfig.database
	})
};

database.initialize = function () {

	this.connection.connect();
};

/** TWEETS **/
database.saveTweet = function (tweet) {

	var tweetText = this.escapeSingleQuotes(tweet.text);
	this.connection.query('INSERT INTO ' + dbConfig.database + '.tweets VALUES(null, \'' + tweetText + '\', \'' + tweet.id_str + '\', \'' + tweet.user.screen_name + '\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')', function (error, results, fields) {
		if (error) {
			console.log(error);
			throw error;
		}
	});

};

// RETWEETS
database.saveRetweet = function (tweet) {

	var retweetText = this.escapeSingleQuotes(tweet.retweeted_status.text);
	this.connection.query('INSERT INTO ' + dbConfig.database + '.retweets VALUES(null, \'' + tweet.retweeted_status.id_str + '\', \'' + tweet.retweeted_status.user.screen_name + '\', \'' + retweetText + '\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')', function (error, results, fields) {
		if (error) {
			console.log(error);
			throw error;
		}
	});

};

// GET
database.getNumberOfTweetsInLastMinute = function (callback) {

	var that = this;
	var numberOfTweets = 0;
	var timeInMinutes = 1;
	var dateMysql = this.getDateTimeInMySQLFormatXMinutesAgo(timeInMinutes);
	that.connection.query('SELECT COUNT(*) AS count FROM tweets WHERE published >= \'' + dateMysql + '\'', function (error, results, fields) {

		if (results !== undefined) {
			numberOfTweets = results[0].count;
			that.connection.query('SELECT COUNT(*) AS count FROM retweets WHERE published >= \'' + dateMysql + '\'', function (error, results, fields) {

				numberOfTweets += results[0].count;
				callback(numberOfTweets);
			});
		} else {
			callback(numberOfTweets);
		}

	});

};

database.getLastTweetFromDatabase = function (callback) {

	var query = 'SELECT * FROM ' + dbConfig.database + '.tweets ORDER BY published DESC LIMIT 0,1';
	this.connection.query(query, function (error, results, fields) {
		var lastTweet = results[0];
		callback(lastTweet);
	});
};

// REMOVE
database.cleanOldData = function (timeInMinutes) {

	// Get date for X minutes ago
	var dateMysql = this.getDateTimeInMySQLFormatXMinutesAgo(timeInMinutes);

	// Clean old data from the different tables
	this.connection.query('DELETE FROM ' + dbConfig.database + '.tweets WHERE published < \'' + dateMysql + '\'');
	this.connection.query('DELETE FROM ' + dbConfig.database + '.retweets WHERE published < \'' + dateMysql + '\'');
	this.connection.query('DELETE FROM ' + dbConfig.database + '.users WHERE published < \'' + dateMysql + '\'');

};

/** USERS **/
database.saveUsers = function (users) {

	if (!users) return;

	var that = this;
	users.forEach(function (user) {
		that.connection.query('INSERT INTO ' + dbConfig.database + '.users VALUES(null, \'' + user + '\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')');
	});

};

/** USER IMAGES **/
database.getUserImage = function (user, callback) {

	var query = 'SELECT * FROM `user_images` WHERE screen_name = \'' + user + '\'';
	this.connection.query(query, function (error, results, fields) {

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

	this.connection.query('INSERT INTO ' + dbConfig.database + '.user_images VALUES(null, \'' + user + '\', \'' + userImage + '\', \' ' + database.currentDateTimeInMySQLFormat() + ' \')');

};

database.getMostHatedUser = function (callback) {

	var timeInMinutes = 2;
	var dateMysql = this.getDateTimeInMySQLFormatXMinutesAgo(timeInMinutes);
	var query = 'SELECT `user`, COUNT(`user`) AS `user_occurrence` FROM `users` WHERE published > \'' + dateMysql + '\' GROUP BY `user` ORDER BY `user_occurrence` DESC LIMIT 1';
	this.connection.query(query, function (error, results, fields) {

		if (!results) {
			callback(false);
		} else {
			var user = results[0];
			callback(user);
		}
	});
};

database.getMostHatedUserExampleTweet = function (user, callback) {

	var that = this;

	// FIRST WE RETRIEVE THE EXAMPLE FROM SIMPLE TWEETS
	var query = 'SELECT * FROM `tweets` WHERE tweet LIKE \'%' + user + '%\' ORDER BY `published` DESC LIMIT 1';
	this.connection.query(query, function (error, results, fields) {

		if (results) {

			var tweet = results[0];
			callback(tweet);

		} else {

			// IF NO RESULTS WITH TWEETS, WE SEARCH ON RETWEETS
			var query = 'SELECT * FROM `retweets` WHERE retweeted_text LIKE \'%' + user + '%\' ORDER BY `published` DESC LIMIT 1';
			that.connection.query(query, function (error, results, fields) {

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

	var timeInMinutes = 2;
	var dateMysql = this.getDateTimeInMySQLFormatXMinutesAgo(2);
	var that = this;

	// FIRST WE SEARCH FOR THE HATEFUL USER ON RETWEETS, AS IT'S ON THEM WHERE THE INFLUENCE HAPPENS
	var query = 'SELECT `retweeted_user` AS `user`, `retweeted_id` AS `id_str`, `retweeted_text` AS `text`, COUNT(`id`) AS `user_occurrence` FROM `retweets` WHERE retweeted_text LIKE \'%@%\' AND published > \'' + dateMysql + '\' GROUP BY `retweeted_user` ORDER BY `user_occurrence` DESC LIMIT 1';
	console.log(query);
	that.connection.query(query, function (error, results, fields) {

		if (results) {
			var user = results[0];
			callback(user);

		} else {

			// IF NO RETWEETS WITH HATE, WE SEARCH ON SIMPLE TWEETS
			var query = 'SELECT `screen_name` AS `user`, `id_str`, `tweet` AS `text`, COUNT(`id`) AS `user_occurrence` FROM `tweets` WHERE tweet LIKE \'%@%\' AND published > \'' + dateMysql + '\' GROUP BY `screen_name` ORDER BY `user_occurrence` DESC LIMIT 1';
			that.connection.query(query, function (error, results, fields) {

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

	this.connection.query(query, function (error, results, fields) {

		callback(results);
	});

};

database.getHistoricNumberTweets = function (callback) {

	var limit = 43200; // 30 days of historic data

	var query = 'SELECT `id`, `number_tweets`, `date`' +
		'FROM `historic` ORDER BY `date` DESC LIMIT 0, ' + limit;
	this.connection.query(query, function (error, results, fields) {

		callback(results);
	});

};

database.saveHistoricData = function (
	numberTweets,
	hatedUser, hatedUserExampleTweetText, hatedUserExampleTweetId, hatedUserExampleTweetUser,
	hatefulUser, hatefulUserTweetText, hatefulUserTweetId) {

	hatedUserExampleTweetText = this.escapeSingleQuotes(hatedUserExampleTweetText);
	hatefulUserTweetText = this.escapeSingleQuotes(hatefulUserTweetText);

	this.connection.query(
		'INSERT INTO ' + dbConfig.database + '.historic VALUES(null, \'' + numberTweets + '\', \'' +
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

module.exports = database;