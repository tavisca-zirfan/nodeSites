var express = require('express');

module.exports = function(){
	console.log("reached express");
	var app = express();

	app.set('views','./app/views');
	app.set('view engine','jade');
	app.use(express.static('./public'));
	require('../app/routes/index.server.route')(app);
	//app.use(express.static('./public'));

	return app;
}