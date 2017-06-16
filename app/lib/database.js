/** DATABASE **/
var dbConfig = require(global.appRoot + '/config/database.json');
var mysql = require('mysql');

var database = {
	connection: mysql.createConnection({
		host     : dbConfig.host,
		user     : dbConfig.user,
		password : dbConfig.password,
		database : dbConfig.database
	})
};

database.mysqlDate = function(date) {
	date = new Date();
	return date.toISOString().split('T')[0];
};

database.escapeSingleQuotes = function(string) {

	string = string.split("'").join("\\\'");
	return string;
}

database.initialize = function() {

	this.connection.connect();
};


database.insertTweetToDatabase = function(tweet) {

	var tweetText = this.escapeSingleQuotes(tweet.text);
	this.connection.query('INSERT INTO ' + dbConfig.database + '.tweets VALUES(null, \'' + tweetText + '\', \' ' + database.mysqlDate(tweet.created_at) + ' \')', function (error, results, fields) {
		if (error) {
			console.log(error);
			throw error;
		}
	});

};

database.insertRetweetToDatabase = function(tweet) {

	this.connection.query('INSERT INTO ' + dbConfig.database + '.retweets VALUES(null, \'' + tweet.retweeted_status.id + '\', \' ' + database.mysqlDate(tweet.created_at) + ' \')', function (error, results, fields) {
		if (error) {
			console.log(error);
			throw error;
		}
	});

};

database.getNumberOfTweetsInLastMinute = function(callback) {

	var that = this;
	var numberOfTweets = 0;
	that.connection.query('SELECT COUNT(*) AS count FROM tweets', function (error, results, fields) {

		numberOfTweets = results[0].count;
		that.connection.query('SELECT COUNT(*) AS count FROM retweets', function (error, results, fields) {

			numberOfTweets += results[0].count;
			callback(numberOfTweets);
		});

	});

};

module.exports = database;