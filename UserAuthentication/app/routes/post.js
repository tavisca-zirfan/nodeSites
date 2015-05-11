var express = require('express');
var route = express.Router();
var TextPost = require('../models/TextPost');
var EventPost = require('../models/EventPost');
var postController = require('../controllers/postController');

route.get('/post/create',isAuthenticated,function(req,res){
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
			
				res.send("created text post");
		}
	});
	
});

route.get('/event/create',isAuthenticated,function(req,res){
	var post = new EventPost({
		text:'My first event',
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
			res.send("Event could not be created");
		else{
			
			res.send("created event");
		}
	});
	
});

route.get('/post',isAuthenticated,function(req,res){
	
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

route.get('/post/delete/:id',isAuthenticated,function(req,res){
	postController.delete(req.user,req.params.id,function(result){
		res.send(result);
	})
});

route.get('/post/addComment/:id',isAuthenticated,function(req,res){
	postController.addComment(req.user,req.params.id,'my added comment',function(result){
		res.send(result);
	})
});

route.get('/post/removeComment/:postId/:commentId',isAuthenticated,function(req,res){
	postController.removeComment(req.user,req.params.postId,req.params.commentId,function(result){
		res.send(result);
	})
});

route.get('/post/addLike/:postId/',isAuthenticated,function(req,res){
	postController.addLike(req.user,req.params.postId,function(result){
		res.send(result);
	})
});

route.get('/post/addDislike/:postId',isAuthenticated,function(req,res){
	postController.addDislike(req.user,req.params.postId,function(result){
		res.send(result);
	})
});

route.get('/post/addCommentLike/:postId/:commentId',isAuthenticated,function(req,res){
	postController.addCommentLike(req.user,req.params.postId,req.params.commentId,function(result){
		res.send(result);
	})
});

route.get('/post/addCommentDislike/:postId/:commentId',isAuthenticated,function(req,res){
	postController.addCommentDislike(req.user,req.params.postId,req.params.commentId,function(result){
		res.send(result);
	})
});

route.get('/post/removeCommentLike/:postId/:commentId',isAuthenticated,function(req,res){
	postController.removeCommentLike(req.user,req.params.postId,req.params.commentId,function(result){
		res.send(result);
	})
});

route.get('/post/removeCommentDislike/:postId/:commentId',isAuthenticated,function(req,res){
	postController.removeCommentDislike(req.user,req.params.postId,req.params.commentId,function(result){
		res.send(result);
	})
});
function isAuthenticated(req,res,next){
	if(req.isAuthenticated())
		return next();	
	res.redirect('/login');
}

module.exports = route;