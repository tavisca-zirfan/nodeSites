var passport = require('passport');
var User = require('../app/models/User');
var userController=require('../app/controllers/userController');
var localStrategy = require('passport-local').Strategy;
var facebookStrategy = require('passport-facebook').Strategy;
var authConfig = require('../config/configAuth');

passport.serializeUser(function(user,done){
	done(null,user);
});

passport.deserializeUser(function(user,done){
	done(null,user);
});

passport.use('local-signin',new localStrategy(function(username,password,done){
	process.nextTick(function(){
		userController.getLocal(username,function(user,error){
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

passport.use('local-signup',new localStrategy({usernameField:'email',passReqToCallback:true},function(req,username,password,next){
	process.nextTick(function(){
		console.log('creating user');
		userController.createLocal(req.body,function(user,error){
			console.log(user);
			if(error){
				return next(error);
			}else
				return next(null,user);
		});
	})
	
}))

passport.use(new facebookStrategy({
	clientID:authConfig.facebook.clientID,
	clientSecret:authConfig.facebook.clientSecret,
	callbackURL:authConfig.facebook.callbackURL,
},
function(token,refreshToken,profile,next){
	process.nextTick(function(){
		userController.getOrCreateFacebook(token,profile,function(user,error){
			if(error)
				return next(error,null);
			return next(null,user);
		});		
	});
}));

module.exports = passport;