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

	this.postTweetHateful();
	//this.postTweetHated();

};

OdiometroBot.postTweetHateful = function () {

	var that = this;

	database.getMostHatefulUserAndTweet(function (tweet) {

		var templateResumeFirst = '🔪 Resumen diario del Odio en Twitter\n' +
			'📅 ' + new Date().toJSON().slice(0, 10).split('-').reverse().join('/') + '\n' +
			'📈 Media: 203 tuits/odio minuto\n' +
			'🔥 Pico: 352 tuits/odio minuto\n\n' +
			'👇👇👇 (continúa)';

		var templateResumeSecond = '😠 El usuario que más odio ha propagado es @donpepitobot, con este tuit: https://twitter.com/donpepitobot/status/12634';
		var templateResumeThird = '🤕 El usuario que más odio ha recibido es @donpepitobot, con tuits como este: https://twitter.com/donpepitobot/status/1263403275258388485';
		var templateResumeLast = 'Recordatorio:\n👉 tuits/odio por minuto incluye retuits\n' +
			'👉 el odio no es fácil de identificar de manera automatizada, por lo que puede haber errores en los datos, ¡no nos odies por ello!';


		//var mostHatefulUserTweet = { tweet: tweet.text, id_str: tweet.id_str, screen_name: tweet.user};
		//that.twitter.postTweet(templateResumeFirst);
		that.twitter.postTweetAsReplyTo(templateResumeThird, '1263403275258388485');
	});

};



OdiometroBot.getTemplateHateful = function () {

	var templates = [
		'Parece que [user] es el usuario que más odio ha generado en las '
	];

};

module.exports = OdiometroBot;