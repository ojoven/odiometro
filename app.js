/** APP **/
// Node app

var acceptedLangs = ['es', 'en'];

// GET parameters
var args = process.argv.slice(2);

// GET language
var defaultLang = 'es';
global.lang = (args && typeof args[0] !== "undefined" && acceptedLangs.indexOf(args[0]) !== -1) ? args[0] : defaultLang;

// ROOT PATH
var path = require('path');
global.appRoot = path.resolve(__dirname);

// Initialize express
var express = require('express'),
	app = express();

var port = process.env.PORT || 8001;

// Libs
var database = require("./app/lib/database.js");
var twitter = require("./app/lib/twitter.js");
var twitterStream = require("./app/lib/twitterStream.js")(twitter);
var track = require(global.appRoot + '/public/track_' + global.lang + '.json');

// Models
var Tweet = require("./app/models/Tweet.js");
var Historic = require("./app/models/Historic.js");

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.
var io = require('socket.io').listen(app.listen(port));

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.
require('./config')(app, io);
require('./routes')(app, io);

// Logging
console.log('Odiometro is running on http://localhost:' + port);

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

		var tweetText;

		// FILTER: If it's not a hate tweet, we ignore it
		if (!Tweet.isItAHateTweet(tweet)) return;

		// Dispatcher: Is it a retweet?
		if (Tweet.isItARetweet(tweet)) {
			database.saveRetweet(tweet);
			tweetText = tweet.retweeted_status.text;
		} else {

			// Or it is a tweet
			console.log(tweet.text);
			database.saveTweet(tweet);
			tweetText = tweet.text;

			// Is it a tweet to be shown?
			if (Tweet.isItATweetToBeShown(tweet, track)) {
				io.sockets.emit('tweet', tweet.text);
			}

		}

		// Save the users
		var users = Tweet.getUsernamesInTweet(tweetText);
		database.saveUsers(users);

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
				if (tweet) {
					mostHatedUsersLastTweet = tweet.tweet;
					io.sockets.emit('most_hated_user_tweet', tweet);
				}
			});
		}
	});
}

// Most hateful user
function emitMostHatefulUserAndTweet() {

	database.getMostHatefulUserAndTweet(function(tweet) {

		if (tweet) {
			mostHatefulUser = tweet.user;
			mostHatefulUserTweet = { tweet: tweet.text, id_str: tweet.id_str, screen_name: tweet.user};
			io.sockets.emit('most_hateful_user', mostHatefulUser);
			io.sockets.emit('most_hateful_user_tweet', mostHatefulUserTweet);
		}
	});
}

// Historic data
function emitHistoric(parameters) {

	var now = new Date();
	var hours = 1000*60*60;
	var days = hours*24;
	var dateStartUnix;

	if (parameters.type === 'hour') {
		dateStartUnix = new Date(now.getTime() - (parameters.number*hours));
	} else if (parameters.type === 'day') {
		dateStartUnix = new Date(now.getTime() - (parameters.number*days));
	}

	var dateStart = dateStartUnix.toISOString().slice(0, 19).replace('T', ' ');
	var dateEnd = now.toISOString().slice(0, 19).replace('T', ' '); // now

	database.getHistoricData(dateStart, dateEnd, function(historicData) {

		var data = {};
		data.resume = Historic.getResumeFromData(historicData);
		data.labels = Historic.getLabels(historicData);
		data.graphData = Historic.parseHistoricDataForGraph(historicData);
		data.graphData = Historic.decimate(data.graphData, parameters);

		io.sockets.emit('historic', data);
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

			if (!tweet) return;

			mostHatedUsersLastTweet = tweet.tweet;
			mostHatedUsersLastTweetId = tweet.id_str;
			mostHatedUsersLastTweetUser = tweet.screen_name;

			database.getMostHatefulUserAndTweet(function(tweet) {

				if (!tweet) return;

				mostHatefulUser = tweet.user;
				mostHatefulUserTweet = tweet.text;
				mostHatefulUserTweetId = tweet.id_str;

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