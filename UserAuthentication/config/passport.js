var passport = require('passport');
var User = require('../app/models/User');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var authConfig = require('../config/configAuth');

passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(user,done){
	done(null,user);
});

passport.use(new localStrategy(function(username,password,done){
	process.nextTick(function(){
		User.findOne({'local.email':username},function(error,user){
			console.log(user);
			if(error)
				return done(error,false);
			else if(!user)
				return done(null,false);
			else if(user.local.password !=password)
				return done(null,false);
			else
				return done(null,user);
		});
	});
}));

passport.use(new facebookStrategy({
	clientID:authConfig.facebook.clientID,
	clientSecret:authConfig.facebook.clientSecret,
	callbackURL:authConfig.facebook.callbackURL,
},
function(token,refreshToken,profile,next){
	process.nextTick(function(){
		console.log(profile);
		return next(null,profile);
	})
}));

module.exports = passport;