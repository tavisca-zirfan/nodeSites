var passport = require('passport');
var User = require('../app/models/User');
var localStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(user,done){
	done(null,user);
});

passport.use(new localStrategy(function(username,password,done){
	process.nextTick(function(){
		User.findOne({name:username},function(error,user){
			if(error)
				return done(error,false);
			else if(!user)
				return done(null,false);
			else if(user.password !=password)
				return done(null,false);
			else
				return done(null,user);
		});
	});
}));

module.exports = passport;