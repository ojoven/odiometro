/** APP **/
// Node app

var acceptedLangs = ['es', 'en'];
var args = process.argv.slice(2);
var defaultLang = 'es';
global.lang = (args && typeof args[0] !== "undefined" && acceptedLangs.indexOf(args[0]) !== -1) ? args[0] : defaultLang;

// ROOT PATH
var path = require('path');
global.appRoot = path.resolve(__dirname);

// Initialize express
var express = require('express'),
	app = express();

// Libs
var database = require("./app/lib/database.js");
var track = require(global.appRoot + '/public/track_' + global.lang + '.json');

// Models
var Tweet = require("./app/models/Tweet.js");

// Logging
console.log('Odiometro Bot is running on http://localhost:' + port);

// Initialize Twitter

