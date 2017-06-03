var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,next){
	return next(null,user);
});

passport.deserializeUser(function(user,next){
	return next(null,user);
});

passport.use('local-login',new localStrategy(
	function(username,password,next){
		console.log(username);
		var user = {name:username};
		return next(null,user);
	}
));

module.exports = passport;