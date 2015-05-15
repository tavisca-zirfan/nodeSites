var passport = require('../../config/passport');
var path = require('path');
var express = require('express');
var userController = require('../controllers/userController');
var route = express.Router();
var _ = require('underscore');
var defaultPaging = require('../utils/pagination');

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
	var filter = {};
	var pagination = _.extend({},defaultPaging,req.query.pagination);
	if(req.query.name) filter.name = req.query.name;
	if(req.query.listOfIds) var listOfIds = req.query.listOfIds;
	userController.getAll({},filter,listOfIds,pagination,function(users,error){
		if(error){
			res.status(302).send(error);
		}
		resultArray = [];
		users.forEach(function(user,index){
			var userJSON = user.toJSON();
			userJSON.profile._id = userJSON._id;
			userJSON.profile.accountInfo = userJSON.accountInfo;
			userJSON.profile.friends = userJSON.friends;
			resultArray.push(userJSON.profile);
		});
		res.status(200).send(resultArray);
	});
	
});

route.get('/api/profile/:id',isAuthenticated,function(req,res,next){
	userController.getById(req.user,req.params.id,function(user,error){
		if(error){
			res.status(404).send({message:'User not found'});
		}
		var userJSON = user.toJSON();
		userJSON.profile._id = userJSON._id;
		userJSON.profile.accountInfo = userJSON.accountInfo;
		res.status(200).send(userJSON.profile);
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