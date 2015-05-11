var passport = require('../../config/passport');
var path = require('path');
var express = require('express');
var userController = require('../controllers/userController');
var route = express.Router();

route.get('/profile/:id?',isAuthenticated,function(req,res){
	var currentUser = {
		_id:req.user._id,
		profile:req.user.profile,
		friends:req.user.friends
	};
	if(req.params.id){
		var profileId = req.params.id;
	}else{
		profileId = currentUser._id;
	}
	res.render('profile',{user:currentUser,sidebarNotRequired:true,profileId:profileId});
});

route.get('/api/profile',isAuthenticated,function(req,res){
	userController.getAll({},null,function(users,error){
		if(error){
			res.status(302).send(error);
		}
		resultArray = [];
		users.forEach(function(user,index){
			resultArray.push({profile:user.profile,_id:user._id,friends:user.friends});
		});
		res.status(200).send(users);
	});
	
});

route.get('/api/profile/:id',isAuthenticated,function(req,res,next){
	userController.getById(req.user,req.params.id,function(user,error){
		if(error){
			res.status(404).send({message:'User not found'});
		}
		user.profile._id = user._id;
		user.profile.accountInfo = user.accountInfo;
		res.status(200).send(user.profile);
	});
});

route.post('/profile/upload',function(req,res,next){
	var path = '/uploads/'+req.user._id+'/'+req.files.profilepic.name;
	req.user.profile.imageUrl = path;
	userController.update({_id:req.user._id},{'profile.imageUrl':path},{},function(err,noOfRows){
		if(!err && noOfRows.nModified>0){
			res.status(200).send({path:path});
		}
	});
	
});

route.put('/api/profile/:id',function(req,res,next){
	userController.update({_id:req.user._id},{profile:req.body},{},function(err,noOfRows){		
		if(!err && noOfRows.nModified>0){
			res.status(200).send();
		}
	});
});

function isAuthenticated(req,res,next){
	if(req.isAuthenticated())
		return next();	
	res.redirect('/login');
}

module.exports = route;