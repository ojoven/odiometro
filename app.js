/*
|--------------------------------------------------------------------------
| INITIALIZATION
|--------------------------------------------------------------------------
*/

// Languages
var acceptedLangs = ['es', 'en'];
var args = process.argv.slice(2);
var defaultLang = 'es';
global.lang = (args && typeof args[0] !== "undefined" && acceptedLangs.indexOf(args[0]) !== -1) ? args[0] : defaultLang;

// Path and ENV
var path = require('path');
global.appRoot = path.resolve(__dirname);
require('dotenv').config();
global.urlBase = process.env.URL_BASE;
global.phantomJsBin = process.env.PHANTOMJS;

// Initialize express
var express = require('express'),
	app = express();

var port = process.env.PORT || 8001;

var io = require('socket.io').listen(app.listen(port));
require('./config')(app, io);
require('./routes')(app, io);

// Libs
var database = require("./app/lib/database.js");
var twitter = require("./app/lib/twitter.js");
var twitterStream = require("./app/lib/twitterStream.js")(twitter);
var track = require(global.appRoot + '/public/track_' + global.lang + '.json');

// Models
var Tweet = require("./app/models/Tweet.js");
var Historic = require("./app/models/Historic.js");

// Logging
console.log('Odiometro is running on http://localhost:' + port);

// Vars
var numberTweets, mostHatedUser, mostHatedUsersLastTweet, mostHatefulUser, mostHatefulUserTweet, mostHatefulUserTweetId;

/*
|--------------------------------------------------------------------------
| EVENT CATCHING
|--------------------------------------------------------------------------
*/
// When socket connection
io.on('connection', function (socket) {

	// Immediately send the number of tweets/retweets last minute
	socket.on('retrieve_number_tweets', function () {
		emitNumberTweets(socket);
	});

	// Immediately send the last tweet
	socket.on('retrieve_last_tweet', function () {
		emitLastTweet(socket);
	});

	// Immediately send the most hated user (and the first tweet)
	socket.on('retrieve_most_hated_user', function () {
		emitMostHatedUserAndTweet(socket);
	});

	// Immediately send the most hated user (and the first tweet)
	socket.on('retrieve_most_hateful_user', function () {
		emitMostHatefulUserAndTweet(socket);
	});

	// Immediately send the historic
	socket.on('retrieve_historic', function (parameters) {
		emitHistoric(parameters, socket);
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

				var tweetParsed = {};
				tweetParsed.id_str = tweet.id_str;
				tweetParsed.tweet = tweet.text;
				tweetParsed.screen_name = tweet.user.screen_name;

				io.sockets.emit('tweet', tweetParsed);
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

/*
|--------------------------------------------------------------------------
| EMIT DATA
|--------------------------------------------------------------------------
*/
// Last tweet
function emitLastTweet(socket) {

	database.getLastTweetFromDatabase(function (tweet) {
		socket.emit('tweet', tweet);
	});
}

// Number Tweets
function emitNumberTweets(socket) {

	database.getNumberOfTweetsInLastMinute(function (number_tweets) {
		numberTweets = number_tweets;
		var data = {
			number_tweets: number_tweets
		};
		socket.emit('number_tweets', data);
	});
}

// Most hated user
function emitMostHatedUserAndTweet(socket) {


	database.getMostHatedUser(function (user) {

		if (user) {
			mostHatedUser = user.user;
			socket.emit('most_hated_user', user);

			database.getMostHatedUserExampleTweet(mostHatedUser, function (tweet) {
				if (tweet) {
					mostHatedUsersLastTweet = tweet.tweet;
					socket.emit('most_hated_user_tweet', tweet);
				}
			});

			database.getUserImage(mostHatedUser, function (userImage) {

				if (userImage) {
					socket.emit('most_hated_user_image', userImage);
				} else {
					twitter.get('users/show', {
						screen_name: mostHatedUser
					}, function (err, dataUser, response) {
						var imageUrl = dataUser.profile_image_url_https;
						if (imageUrl) {
							imageUrl = imageUrl.replace('_normal', '');
							database.saveUserImage(mostHatedUser, imageUrl);
							socket.emit('most_hated_user_image', userImage);
						}
					})
				}
			});

		}
	});
}

// Most hateful user
function emitMostHatefulUserAndTweet(socket) {

	database.getMostHatefulUserAndTweet(function (tweet) {

		if (tweet) {
			mostHatefulUser = tweet.user;
			mostHatefulUserTweet = {
				tweet: tweet.text,
				id_str: tweet.id_str,
				screen_name: tweet.user
			};
			socket.emit('most_hateful_user', mostHatefulUser);
			socket.emit('most_hateful_user_tweet', mostHatefulUserTweet);

			database.getUserImage(mostHatefulUser, function (userImage) {

				if (userImage) {
					socket.emit('most_hateful_user_image', userImage);
				} else {
					twitter.get('users/show', {
						screen_name: mostHatefulUser
					}, function (err, dataUser, response) {
						var imageUrl = dataUser.profile_image_url_https;
						if (imageUrl) {
							imageUrl = imageUrl.replace('_normal', '');
							database.saveUserImage(mostHatefulUser, imageUrl);
							socket.emit('most_hateful_user_image', userImage);
						}
					})
				}
			});
		}
	});
}

// Historic data
function emitHistoric(parameters, socket) {

	var date = Historic.getDatesFromParameters(parameters);

	database.getHistoricData(date.start, date.end, function (historicData) {

		var data = Historic.parseHistoricData(parameters, historicData, averages);
		socket.emit('historic', data);
	});

}


/*
|--------------------------------------------------------------------------
| FREQUENT UPDATES
|--------------------------------------------------------------------------
*/
// Number Tweets
var frequencyOfUpdateNumberTweets = 500;
setInterval(function () {
	emitNumberTweets(io.sockets);
}, frequencyOfUpdateNumberTweets);

// Most Hated and Hateful Users
var frequencyMostHatedHatefulUser = 10000;
setInterval(function () {
	emitMostHatedUserAndTweet(io.sockets);
	emitMostHatefulUserAndTweet(io.sockets);
}, frequencyMostHatedHatefulUser);

// Save historic data
var frequencyOfHistoricData = 60000; // 1 minute in miliseconds
var mostHatedUsersLastTweetId, mostHatedUsersLastTweetUser;

setInterval(function () {

	database.getMostHatedUser(function (user) {

		if (!user) return;

		mostHatedUser = user.user;

		// We need to get first the most hated user's last tweet
		database.getMostHatedUserExampleTweet(mostHatedUser, function (tweet) {

			if (!tweet) return;

			mostHatedUsersLastTweet = tweet.tweet;
			mostHatedUsersLastTweetId = tweet.id_str;
			mostHatedUsersLastTweetUser = tweet.screen_name;

			database.getMostHatefulUserAndTweet(function (tweet) {

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
setInterval(function () {
	database.cleanOldData(timeBeforeTweetsAreCleaned);
}, frequencyOfCleaningTweets);

// Run functions when server starts
database.cleanOldData(timeBeforeTweetsAreCleaned);

// GET AVERAGES
var averages = [];

function updateAverages() {
	database.getHistoricNumberTweets(function (results) {
		averages = Historic.createAveragesFromHistoricNumberTweets(results);
	});
}

updateAverages();

var frequencyOfUpdatingAverages = 86400000; // Once a day
setInterval(function () {
	updateAverages();
}, frequencyOfUpdatingAverages);

/*
|--------------------------------------------------------------------------
| RESUME AUXILIARY PAGE
|--------------------------------------------------------------------------
*/
app.get('/resume', function (req, res) {

	var hours = req.query.hours !== undefined ? req.query.hours : 24;;

	var dateStart = database.getDateTimeInMySQLFormatXMinutesAgo(60 * hours);
	var dateEnd = database.currentDateTimeInMySQLFormat();

	database.getHistoricData(dateStart, dateEnd, function (historicData) {

		var average = Historic.getAverageNumTweetsFromHistoricData(historicData);
		var max = Historic.getMaxNumTweetsFromHistoricData(historicData);
		var hatefulUser = Historic.getMostHatefulUserAndTweetFromHistoricData(historicData);
		var hatedUser = Historic.getMostHatedUserAndTweetFromHistoricData(historicData);

		console.log(average);
		console.log(max);
		console.log(hatefulUser);
		console.log(hatedUser);

		database.getUserImage(hatefulUser.user, function (hatefulUserImage) {

			database.getUserImage(hatedUser.user, function (hatedUserImage) {

				res.render('resume', {
					hours: hours,
					averageNum: average,
					maxNum: max,
					mostHatefulUser: {
						screen_name: hatefulUser.user,
						image_url: hatefulUserImage.image_url
					},
					mostHatedUser: {
						screen_name: hatedUser.user,
						image_url: hatedUserImage.image_url
					},
				});

			});

		});

	});

});

/*
|--------------------------------------------------------------------------
| LAUNCH RESUME TWEET
|--------------------------------------------------------------------------
*/
app.get('/tweet', function (req, res) {

	// Initialize Twitter
	var twitter = require("./app/lib/twitter.js");
	var OdiometroBot = require("./app/models/OdiometroBot.js");

	if (req.query.key != process.env.KEY) {
		res.send('You shall not pass!');
		return false;
	}

	var hours = req.query.hours !== undefined ? req.query.hours : 24;
	var lastTweet = req.query.lastTweet === undefined ? false : true;

	OdiometroBot.initialize(twitter);
	OdiometroBot.postResumeTweet(hours, lastTweet);
	res.send('Tweet sent!');

});