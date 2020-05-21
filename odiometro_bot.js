/** APP **/
// Node app

// ROOT PATH
var path = require('path');
global.appRoot = path.resolve(__dirname);

// Initialize express
var express = require('express'),
	app = express();

// Cron
const cron = require("node-cron");

var port = process.env.PORT || 8002;

// Language (ES for the moment)
var acceptedLangs = ['es', 'en'];
var args = process.argv.slice(2);
var defaultLang = 'es';
global.lang = (args && typeof args[0] !== "undefined" && acceptedLangs.indexOf(args[0]) !== -1) ? args[0] : defaultLang;

// Libs
var database = require("./app/lib/database.js");
var twitter = require("./app/lib/twitter.js");
var OdiometroBot = require("./app/models/OdiometroBot.js");

// Logging
console.log('Odiometro Bot is running on http://localhost:' + port);

// Initialize Twitter
OdiometroBot.initialize(twitter);
OdiometroBot.postDailyResumeTweets();

// Una vez al día, a las 10 de la noche hora española
cron.schedule("* * * * *", function () {
	console.log("running a task every minute");
	//OdiometroBot.postTweet();
});