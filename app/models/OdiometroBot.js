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

	postResumeTweet: function (hours, lastTweet) {

		var that = this;

		var dateStart = database.getDateTimeInMySQLFormatXMinutesAgo(24 * hours);
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

			var templateResumeFirst = '🔪 Odio en Twitter *' + OdiometroBot.getLastMessageFromHours(hours) + '*\n\n' +
				'📈 Media: ' + average + ' tuits/odio minuto\n' +
				'🔥 Máxima: ' + max + ' tuits/odio minuto\n\n' +
				'👇👇👇 (continúa)';

			var templateResumeSecond = '😠 Quien más odio ha propagado es @' + hatefulUser.user + ', con este tuit: https://twitter.com/' + hatefulUser.user + '/status/' + hatefulUser.id_str;
			var templateResumeThird = '🤕 Quien más odio ha recibido es ' + hatedUser.user + ', con tuits como este: https://twitter.com/' + hatedUser.hatefulUser + '/status/' + hatedUser.id_str;
			var templateResumeLast = '👉 Recuerda: mira nuestro tuit fijado para saber más sobre el proyecto Odiómetro y su objetivo.\n\n' +
				'👉 Síguenos para recibir el resumen diario.\n\n👉 Entra en https://odiometro.es para ver el odio en tiempo real y el histórico actualizado.';

			console.log(templateResumeFirst);
			console.log(templateResumeSecond);
			console.log(templateResumeThird);
			console.log(templateResumeLast);

			var exec = require('child_process').exec;
			var url = global.urlBase + '/resume?hours=' + hours;
			var cmd = global.phantomJsBin + ' ' + that.pathToPhantomJs + ' ' + url + ' ' + that.pathToMediaFile;

			console.log(cmd);

			exec(cmd, function (error, stdout, stderr) {

				console.log('Screenshot taken!');

				var altText = 'Media tuits/odio minuto: ' + average + '. Máximo tuits/odio minuto: ' + max + '. ¿Quién ha propagado más odio?: @' + hatefulUser.user + '. ¿Quién ha recibido más odio?: ' + hatedUser.user;

				that.twitter.postTweetWithMedia(that.pathToMediaFile, templateResumeFirst, altText, function (firstTweet) {

					that.twitter.postTweetAsReplyTo(templateResumeSecond, firstTweet.id_str, function (secondTweet) {
						that.twitter.postTweetAsReplyTo(templateResumeThird, secondTweet.id_str, function (thirdTweet) {

							if (lastTweet) {
								that.twitter.postTweetAsReplyTo(templateResumeLast, thirdTweet.id_str, function (lastTweet) {
									console.log('Tweets sent! With last tweet');
								});
							} else {
								console.log('Tweets sent! Without last tweet');
							}
						});
					});
				});

			});

		});

	},

	getLastMessageFromHours: function (hours) {

		var last = '';

		if (hours == 1) {
			last = 'ÚLTIMA HORA';
		} else if (hours > 72) {
			last = 'ÚLTIMOS ' + parseInt(hours / 24) + ' DÍAS';
		} else {
			last = 'ÚLTIMAS ' + hours + ' HORAS';
		}

		return last;
	}

};

module.exports = OdiometroBot;