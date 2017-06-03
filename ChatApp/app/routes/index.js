var passport = require('../../config/passport');
var express = require('express');

var router = express.Router();

router.get('/login',function(req,res,next){
	res.render('login');
});

router.post('/login',passport.authenticate('local-login',{
	successRedirect:'/success',
	failureRedirect:'/failure',
}));

router.get('/success',function(req,res,next){
	res.send("Success");
});

router.get('/failure',function(req,res,next){
	res.send("failure");
});

router.get('/chat',function(req,res,next){
	req.io.on('connection',function(socket){
		console.log('a user has been added');
		socket.on('message-recieved',function(message){
			console.log(message);
		});
	})
	res.render('chat',{name:req.user.name});	
})

module.exports = router;