/** DATABASE **/
var dbConfig = require(global.appRoot + '/config/database.json');
var mysql = require('mysql');

var database = {
	connection: mysql.createConnection({
		host     : dbConfig.host,
		user     : dbConfig.user,
		password : dbConfig.password,
		database : dbConfig.database
	})
};

database.initialize = function() {

	this.connection.connect();
};


database.insertTweetToDatabase = function(tweet) {

	this.connection.query('INSERT INTO ' + dbConfig.database + '.tweets VALUES(null, \'' + tweet + '\')', function (error, results, fields) {
		if (error) {
			console.log(error);
			throw error;
		}
		console.log('The solution is: ', results);
	});

};

module.exports = database;