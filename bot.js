/*
|--------------------------------------------------------------------------
| INITIALIZATION
|--------------------------------------------------------------------------
*/
// Bot
var args = process.argv.slice(2);
var defaultBot = 'odiometro';
var bot = (args && typeof args[0] !== "undefined") ? args[0] : defaultBot;

// Path and ENV
var path = require('path');
global.appRoot = path.resolve(__dirname);
require('dotenv').config();
global.urlBase = process.env.URL_BASE;
global.phantomJsBin = process.env.PHANTOMJS;
global.botName = bot;
global.botConfig = require("./config/" + bot + ".json");
global.phantomJsBin = process.env.PHANTOMJS;

// Libs
var twitter = require("./app/lib/twitter.js");
var OdiometroBot = require("./app/models/OdiometroBot.js");

/*
|--------------------------------------------------------------------------
| CRON
|--------------------------------------------------------------------------
*/
const cron = require("node-cron");
cron.schedule("0 19 * * *", function () {
	var hours = 24;
	OdiometroBot.initialize(twitter);
	OdiometroBot.postResumeTweet(hours, true);
	console.log("Daily resume tweet");
});