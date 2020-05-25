/*
|--------------------------------------------------------------------------
| INITIALIZATION
|--------------------------------------------------------------------------
*/
// Language (ES for the moment)
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
var port = process.env.PORT || 8002;

// Libs
var twitter = require("./app/lib/twitter.js");
var OdiometroBot = require("./app/models/OdiometroBot.js");

// Logging
console.log('Odiometro Bot is running on http://localhost:' + port);

/*
|--------------------------------------------------------------------------
| CRON
|--------------------------------------------------------------------------
*/
const cron = require("node-cron");
cron.schedule("0 20 * * *", function () {
	var hours = 24;
	OdiometroBot.initialize(twitter);
	OdiometroBot.postResumeTweet(hours, true);
	console.log("Daily resume tweet");
});