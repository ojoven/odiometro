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

var port = process.env.PORT || 8005;

var io = require('socket.io').listen(app.listen(port));
require('./config')(app, io);
require('./routes')(app, io);

// Libs
var database = require("./app/lib/database.js");
var twitter = require("./app/lib/twitter.js");

// Logging
console.log('Odiometro is running on http://localhost:' + port);

twitter.get('statuses/update', {
	status: tweet
}, function (err, data, response) {
	callback(data)
})