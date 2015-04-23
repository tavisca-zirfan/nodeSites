var passport = require('../../config/passport');
var express = require('express');
var route = express.Router();

route.get('/home',isAuthenticated,function(req,res){
	res.render('home',{user:req.user});
});

route.get('/login',function(req,res,next){
	res.render('login',{});
});

route.post('/login',passport.authenticate('local',{
	successRedirect:'/loginsuccess',
	failureRedirect:'/loginfailure'
}));

route.get('/loginsuccess',function(req,res,next){
	res.send(req.user);
});

route.get('/loginfailure',function(req,res,next){
	res.send('Authentication failed');
});

function isAuthenticated(req,res,next){
	if(req.isAuthenticated())
		return next();	
	res.redirect('/login');
}

module.exports = route;
