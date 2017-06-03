var express = require('express');
var route = express.Router();
var TextPost = require('../models/TextPost');
var EventPost = require('../models/EventPost');

route.get('/post/create',function(req,res,next){
	var post = new TextPost({
		text:'My first post',
		from:req.user._id,
		createdAt:Date.now(),
		updatedAt:Date.now(),
		likes:[req.user._id],
		dislikes:[req.user._id],
		comments:[{
			commentText:'First comment',
			from:req.user._id,
			createdAt:Date.now(),
			likes:[req.user._id],
			dislikes:[req.user._id],
		}]
	});
	post.save(function(error){
		if(error)
			res.send("Post could not be created");
		else{
			// TextPost.find(function(err,users){
			// 	TextPost.populate(users,[{path:'comments.from',model:'users',select:'local.email'},{path:'from',model:'users',select:'local.email'}],function(err,resPost){
			// 		if(err){
			// 			console.log(err);
			// 			res.send('Post created but not fetched');
			// 		}
			// 		else{
			// 			res.send(resPost);
			// 		}
			// 	});
			// });
				res.send("created text post");
		}
	});
	
});

route.get('/event/create',function(req,res,next){
	var post = new EventPost({
		text:'My first post',
		from:req.user._id,
		createdAt:Date.now(),
		updatedAt:Date.now(),
		likes:[req.user._id],
		dislikes:[req.user._id],
		eventDate:Date.now(),
		comments:[{
			commentText:'First comment',
			from:req.user._id,
			createdAt:Date.now(),
			likes:[req.user._id],
			dislikes:[req.user._id],
		}]
	});
	post.save(function(error){
		if(error)
			res.send("Post could not be created");
		else{
			// TextPost.find(function(err,users){
			// 	TextPost.populate(users,[{path:'comments.from',model:'users',select:'local.email'},{path:'from',model:'users',select:'local.email'}],function(err,resPost){
			// 		if(err){
			// 			console.log(err);
			// 			res.send('Post created but not fetched');
			// 		}
			// 		else{
			// 			res.send(resPost);
			// 		}
			// 	});
			// });
			res.send("created event");
		}
	});
	
});

route.get('/post',function(req,res,next){
	
	TextPost.find(function(err,users){
		TextPost.populate(users,[{path:'comments.from',model:'users',select:'local.email'},{path:'from',model:'users',select:'local.email'}],function(err,resPost){
			if(err){
				console.log(err);
				res.send('Post created but not fetched');
			}
			else{
				res.send(resPost);
			}
		});
	});

});

function isAuthenticated(req,res,next){
	if(req.isAuthenticated())
		return next();	
	res.redirect('/login');
}

module.exports = route;