/** ROUTES **/
module.exports = function(app,io){

	app.get('/', function(req, res){

		// Render views/index.html
		res.render('index');
	});

};


