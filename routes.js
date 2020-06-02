/** ROUTES **/
module.exports = function (app, io) {

	var mcache = require('memory-cache');
	var cache = (duration) => {
		return (req, res, next) => {
			let key = '__express__' + req.originalUrl || req.url
			let cachedBody = mcache.get(key)
			if (cachedBody) {
				res.send(cachedBody)
				return
			} else {
				res.sendResponse = res.send
				res.send = (body) => {
					mcache.put(key, body, duration * 1000);
					res.sendResponse(body)
				}
				next()
			}
		}
	}

	app.get('/', cache(3600), function (req, res) {

		res.render(global.botConfig.index);
	});

};