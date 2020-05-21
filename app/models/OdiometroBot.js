/** TWEET **/

var OdiometroBot = {
	twitter: null
};

var database = require("../lib/database.js");

OdiometroBot.initialize = function (twitter) {
	this.twitter = twitter;
};

// Filters //
OdiometroBot.postDailyResumeTweets = function () {

	var that = this;

	var dateStart = database.getDateTimeInMySQLFormatXMinutesAgo(60 * 24);
	console.log(dateStart);
	var dateEnd = database.currentDateTimeInMySQLFormat();

	database.getHistoricData(dateStart, dateEnd, function (historicData) {

		console.log(historicData);

		var average = OdiometroBot.getAverageNumTweetsFromHistoricData(historicData);
		var max = OdiometroBot.getMaxNumTweetsFromHistoricData(historicData);
		var hatefulUser = OdiometroBot.getMostHatefulUserAndTweet(historicData);
		var hatedUser = OdiometroBot.getMostHatedUserAndTweet(historicData);

		console.log(average);
		console.log(max);
		console.log(hatefulUser);
		console.log(hatedUser);

		var templateResumeFirst = '🔪 Odio en Twitter *ÚLTIMAS 24 HORAS*\n\n' +
			'📈 Media: ' + average + ' tuits/odio minuto\n' +
			'🔥 Pico: ' + max + ' tuits/odio minuto\n\n' +
			'👇👇👇 (continúa)';

		var templateResumeSecond = '😠 El usuario que más odio ha propagado es @' + hatefulUser.user + ', con este tuit: https://twitter.com/' + hatefulUser.user + '/status/' + hatefulUser.id_str;
		var templateResumeThird = '🤕 El usuario que más odio ha recibido es ' + hatedUser.user + ', con tuits como este: https://twitter.com/' + hatedUser.hatefulUser + '/status/' + hatedUser.id_str;
		var templateResumeLast = '👉 Recuerda: mira nuestro tuit fijado para saber más sobre el proyecto Odiómetro y su objetivo.\n\n' +
			'👉 Síguenos para recibir el resumen diario.\n\n👉 Entra en https://odiometro.es para ver el odio en tiempo real y el histórico actualizado.';

		console.log(templateResumeFirst);
		console.log(templateResumeSecond);
		console.log(templateResumeThird);
		console.log(templateResumeLast);

		/**
		that.twitter.postTweet(templateResumeFirst, function (firstTweet) {
			that.twitter.postTweetAsReplyTo(templateResumeSecond, firstTweet.id_str, function (secondTweet) {
				that.twitter.postTweetAsReplyTo(templateResumeThird, secondTweet.id_str, function (thirdTweet) {
					that.twitter.postTweetAsReplyTo(templateResumeLast, thirdTweet.id_str, function (lastTweet) {
						console.log('finished!');
					});
				});
			});
		});
		 */

	});

};

OdiometroBot.getAverageNumTweetsFromHistoricData = function (historicData) {

	var total = 0;
	historicData.forEach(function (row) {
		total += row.number_tweets;
	});

	return parseInt(total / historicData.length);
}

OdiometroBot.getMaxNumTweetsFromHistoricData = function (historicData) {

	var max = 0;
	historicData.forEach(function (row) {

		if (row.number_tweets > max)
			max = row.number_tweets;
	});

	return max;
}

OdiometroBot.getMostHatefulUserAndTweet = function (historicData) {

	var users = [];
	historicData.forEach(function (row) {
		users.push(row.hateful_user);
	});

	var tweetId = null;
	var user = mode(users);
	historicData.forEach(function (row) {
		if (row.hateful_user === user) {
			tweetId = row.hateful_user_tweet_id;
		}
	});

	var data = {
		user: user,
		id_str: tweetId
	}

	return data;
}

OdiometroBot.getMostHatedUserAndTweet = function (historicData) {

	var users = [];
	historicData.forEach(function (row) {
		users.push(row.hated_user);
	});

	var tweetId = null;
	var user = mode(users);
	historicData.forEach(function (row) {
		if (row.hated_user === user) {
			tweetId = row.hated_user_example_tweet_id;
			hatefulUser = row.hated_user_example_tweet_user;
		}
	});

	var data = {
		user: user,
		id_str: tweetId
	}

	return data;
}

function mode(array) {
	if (array.length == 0)
		return null;
	var modeMap = {};
	var maxEl = array[0],
		maxCount = 1;
	for (var i = 0; i < array.length; i++) {
		var el = array[i];
		if (modeMap[el] == null)
			modeMap[el] = 1;
		else
			modeMap[el]++;
		if (modeMap[el] > maxCount) {
			maxEl = el;
			maxCount = modeMap[el];
		}
	}
	return maxEl;
}

module.exports = OdiometroBot;