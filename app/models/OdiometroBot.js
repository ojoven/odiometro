/** ODIOMETRO BOT **/

var database = require("../lib/database.js");
var Historic = require("./Historic.js");

var OdiometroBot = {

	twitter: null,
	pathToMediaFile: '/var/www/html/odiometro/public/img/resume/resume.png',
	pathToPhantomJs: '/var/www/html/odiometro/renderers/resume.js',

	initialize: function (twitter) {
		this.twitter = twitter;
	},

	postDailyResumeTweets: function () {

		var that = this;

		var dateStart = database.getDateTimeInMySQLFormatXMinutesAgo(60 * 24);
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

			var templateResumeFirst = '🔪 Odio en Twitter *ÚLTIMAS 24 HORAS*\n\n' +
				'📈 Media: ' + average + ' tuits/odio minuto\n' +
				'🔥 Máxima: ' + max + ' tuits/odio minuto\n\n' +
				'👇👇👇 (continúa)';

			var templateResumeSecond = '😠 El usuario que más odio ha propagado es @' + hatefulUser.user + ', con este tuit: https://twitter.com/' + hatefulUser.user + '/status/' + hatefulUser.id_str;
			var templateResumeThird = '🤕 El usuario que más odio ha recibido es ' + hatedUser.user + ', con tuits como este: https://twitter.com/' + hatedUser.hatefulUser + '/status/' + hatedUser.id_str;
			var templateResumeLast = '👉 Recuerda: mira nuestro tuit fijado para saber más sobre el proyecto Odiómetro y su objetivo.\n\n' +
				'👉 Síguenos para recibir el resumen diario.\n\n👉 Entra en https://odiometro.es para ver el odio en tiempo real y el histórico actualizado.';

			console.log(templateResumeFirst);
			console.log(templateResumeSecond);
			console.log(templateResumeThird);
			console.log(templateResumeLast);

			var exec = require('child_process').exec;
			var cmd = 'phantomjs ' + that.pathToPhantomJs;

			exec(cmd, function (error, stdout, stderr) {

				that.twitter.postTweetWithMedia(that.pathToMediaFile, templateResumeFirst, function () {
					that.twitter.postTweetAsReplyTo(templateResumeSecond, firstTweet.id_str, function (secondTweet) {
						that.twitter.postTweetAsReplyTo(templateResumeThird, secondTweet.id_str, function (thirdTweet) {
							that.twitter.postTweetAsReplyTo(templateResumeLast, thirdTweet.id_str, function (lastTweet) {
								console.log('finished!');
							});
						});
					});
				});

				// command output is in stdout
				console.log('executed!');
			});

		});

	},

};

module.exports = OdiometroBot;