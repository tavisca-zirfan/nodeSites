var express = require('express');
var route = express.Router();

route.get('/home',function(req,res,next){
	res.render('home',{});
});

module.exports = route;
