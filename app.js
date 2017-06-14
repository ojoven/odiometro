/** APP **/
// Node app

// ROOT PATH
var path = require('path');
global.appRoot = path.resolve(__dirname);

// Initialize express
var express = require('express'),
	app = express();

var port = process.env.PORT || 8000;

// Libs
var database = require("./app/lib/database.js");
var twitterStream = require("./app/lib/twitterStream.js");

// Initialize a new socket.io object. It is bound to 
// the express app, which allows them to coexist.
var io = require('socket.io').listen(app.listen(port));

// Require the configuration and the routes files, and pass
// the app and io as arguments to the returned functions.
require('./config')(app, io);
require('./routes')(app, io);

// Logging
console.log('Your application is running on http://localhost:' + port);

// When socket connection
io.on('connection', function (socket) {

	console.log('New user connected');

});

twitterStream.on('tweet', function (tweet) {
	//database.insertTweetToDatabase(tweet.text);
	console.log(tweet.text);
	io.sockets.emit('tweet', tweet.text);
});