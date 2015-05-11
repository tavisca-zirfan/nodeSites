var passport = require('../../config/passport');
var path = require('path');
var express = require('express');
var route = express.Router();

route.get('/home',isAuthenticated,function(req,res){
	res.render('home',{user:req.user});
});

route.get('/login',function(req,res,next){
	res.render('login',{});
});

route.get('/logout',function(req,res,next){
	req.logout();
	res.redirect('/login');
});

route.get('/auth/facebook',passport.authenticate('facebook',{scope:'email'}));

route.get('/auth/facebook/callback',passport.authenticate('facebook',{
	successRedirect:'/profile',
	failureRedirect:'/loginfailure'
}))

route.post('/login',passport.authenticate('local-signin',{
	successRedirect:'/profile',
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
