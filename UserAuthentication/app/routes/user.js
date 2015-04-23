var express = require('express');
var route = express.Router();
var User = require('../models/User');

route.get('/user',function(req,res,next){
	res.render('user',{});
});

route.get('/user/create/:name',function(req,res,next){
	var newUser = new User({
		'name':req.params.name,
		'password':'123456'
	});
	newUser.save(function(error){
		if(error){
			res.send("There was an issue while creating the user");
		}else{
			res.send("User created successfully");
		}
	});
});

route.get('/user/:name',function(req,res,next){
	User.findOne({name:req.params.name},function(err,result){
		if(err){
			res.send("There was an error");
		}else{
			res.send(result);
		}
	});	
});

module.exports = route;