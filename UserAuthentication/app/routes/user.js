var express = require('express');
var route = express.Router();

route.get('/user',function(req,res,next){
	res.render('user',{});
});

module.exports = route;