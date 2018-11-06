/** APP **/
// Node app

// ROOT PATH
var path = require('path');
global.appRoot = path.resolve(__dirname);

// Initialize express
var express = require('express'),
	app = express();

var port = process.env.PORT || 8001;

// Libs
var database = require("./app/lib/database.js");
var twitterStream = require("./app/lib/twitterStream.js");
var track = require(global.appRoot + '/public/track.json');

// Models
var Tweet = require("./app/models/Tweet.js");

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.
var io = require('socket.io').listen(app.listen(port));

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.
require('./config')(app, io);
require('./routes')(app, io);

// Logging
console.log('Your application is running on http://localhost:' + port);

// Vars
var numberTweets, mostHatedUser, mostHatedUsersLastTweet, mostHatefulUser, mostHatefulUserTweet, mostHatefulUserTweetId;

// When socket connection
io.on('connection', function (socket) {

	// Immediately send the number of tweets/retweets last minute
	socket.on('retrieve_number_tweets', function() {
		emitNumberTweets();
	});

	// Immediately send the last tweet
	socket.on('retrieve_last_tweet', function() {
		emitLastTweet();
	});

	// Immediately send the most hated user (and the first tweet)
	socket.on('retrieve_most_hated_user', function() {
		emitMostHatedUserAndTweet();
	});

	// Immediately send the most hated user (and the first tweet)
	socket.on('retrieve_most_hateful_user', function() {
		emitMostHatefulUserAndTweet();
	});

	// Immediately send the historic
	socket.on('retrieve_historic', function(parameters) {
		emitHistoric(parameters);
	});

});

// Twitter Stream
twitterStream.on('tweet', function (tweet) {

	try {

		// FILTER: If it's not a hate tweet, we ignore it
		if (!Tweet.isItAHateTweet(tweet)) return;

		// Dispatcher: Is it a retweet?
		if (Tweet.isItARetweet(tweet)) {
			database.saveRetweet(tweet);
		} else {

			// Or it is a tweet
			console.log(tweet.text);
			database.saveTweet(tweet);

			// Save the users
			var users = Tweet.getUsernamesInTweet(tweet);
			database.saveUsers(users);

			// Is it a tweet to be shown?
			if (Tweet.isItATweetToBeShown(tweet, track)) {
				io.sockets.emit('tweet', tweet.text);
			}

		}

		if (Tweet.isTweetForMostHatedUser(tweet, mostHatedUser)) {
			mostHatedUsersLastTweet = tweet.text;
		}

	} catch (err) {
		console.log(err);
	}

});

// EMIT DATA
// Last tweet
function emitLastTweet() {

	database.getLastTweetFromDatabase(function(tweet) {
		io.sockets.emit('tweet', tweet.tweet);
	});
}

// Number Tweets
function emitNumberTweets() {

	database.getNumberOfTweetsInLastMinute(function(number_tweets) {
		numberTweets = number_tweets;
		var data = { number_tweets: number_tweets };
		io.sockets.emit('number_tweets', data);
	});
}

// Most hated user
function emitMostHatedUserAndTweet() {

	database.getMostHatedUser(function(user) {

		if (user) {
			mostHatedUser = user.user;
			io.sockets.emit('most_hated_user', user);

			database.getMostHatedUserExampleTweet(mostHatedUser, function(tweet) {
				mostHatedUsersLastTweet = tweet.tweet;
				io.sockets.emit('most_hated_user_tweet', tweet);
			});
		}
	});
}

// Most hateful user
function emitMostHatefulUserAndTweet() {

	database.getMostHatefulUserAndTweet(function(retweet) {

		mostHatefulUser = retweet.retweeted_user;
		mostHatefulUserTweet = { tweet: retweet.retweeted_text, id_str: retweet.retweeted_id, screen_name: retweet.retweeted_user };
		io.sockets.emit('most_hateful_user', mostHatefulUser);
		io.sockets.emit('most_hateful_user_tweet', mostHatefulUserTweet);
	});
}

// Historic data
function emitHistoric(parameters) {

	console.log(JSON.stringify(parameters));

	var dateStart = '2018-11-06 14:22:08';
	var dateEnd = '2018-11-06 15:37:14';

	database.getHistoricData(dateStart, dateEnd, function(historicData) {

		io.sockets.emit('historic', historicData);
	});

}


// FREQUENT UPDATES
// Number Tweets
var frequencyOfUpdateNumberTweets = 500;
setInterval(function() {
	emitNumberTweets();
}, frequencyOfUpdateNumberTweets);

// Most Hated and Hateful Users
var frequencyMostHatedHatefulUser = 10000;
setInterval(function() {
	emitMostHatedUserAndTweet();
	emitMostHatefulUserAndTweet();
}, frequencyMostHatedHatefulUser);

// Save historic data
var frequencyOfHistoricData = 60000; // 1 minute in miliseconds
var mostHatedUsersLastTweetId, mostHatedUsersLastTweetUser;

setInterval(function() {

	database.getMostHatedUser(function(user) {

		if (!user) return;

		mostHatedUser = user.user;

		// We need to get first the most hated user's last tweet
		database.getMostHatedUserExampleTweet(mostHatedUser, function(tweet) {
			mostHatedUsersLastTweet = tweet.tweet;
			mostHatedUsersLastTweetId = tweet.id_str;
			mostHatedUsersLastTweetUser = tweet.screen_name;

			database.getMostHatefulUserAndTweet(function(retweet) {

				mostHatefulUser = retweet.retweeted_user;
				mostHatefulUserTweet = retweet.retweeted_text;
				mostHatefulUserTweetId = retweet.retweeted_id;

				database.saveHistoricData(
					numberTweets,
					mostHatedUser, mostHatedUsersLastTweet, mostHatedUsersLastTweetId, mostHatedUsersLastTweetUser,
					mostHatefulUser, mostHatefulUserTweet, mostHatefulUserTweetId
				);
			});

		})
	});

}, frequencyOfHistoricData);

// Clean old data: tweets, retweets and users
var frequencyOfCleaningTweets = 60000; // 1 minute in miliseconds
var timeBeforeTweetsAreCleaned = 10; // 10 minutes
setInterval(function() {
	database.cleanOldData(timeBeforeTweetsAreCleaned);
}, frequencyOfCleaningTweets);

// Run functions when server starts
database.cleanOldData(timeBeforeTweetsAreCleaned);