var express = require('express');
var userController = require('../controllers/userController');
var route = express.Router();
var User = require('../models/User');
var passport = require('../../config/passport');

route.get('/user',function(req,res,next){
	res.render('user',{});
});

route.post('/api/user',passport.authenticate('local-signup'),function(req,res){
	res.status(200).send({__id:req.user.id});
});

route.get('/user/create/:name',function(req,res,next){
	var newUser = new User({
		local:{'email':req.params.name,
			'password':'123456'
		},
		profile:{
			hobbies:[{display_name:'Cricket'}]
		}
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