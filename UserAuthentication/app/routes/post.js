var express = require('express');
var route = express.Router();
var TextPost = require('../models/TextPost');
var EventPost = require('../models/EventPost');
var postController = require('../controllers/postController');
var textPostController = require('../controllers/textPostController');
var eventPostController = require('../controllers/eventPostController');

route.get('/post/',isAuthenticated,function(req,res){
	res.render('post',{user:req.user,sidebarNotRequired:false});
});

route.post('/api/textpost',isAuthenticated,function(req,res){
	textPostController.create(req.user,req.body,(function(post,error){
		console.log("creating text post");
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(post);
	}));	
});

route.get('/api/post',isAuthenticated,function(req,res){
	var filter = {};
	if(req.query.lastUpdate){
		filter.lastUpdate = new Date(req.query.lastUpdate);
	}
	if(req.query.byUser){
		filter.userId = req.query.byUser;
	}	
	postController.get(filter,function(posts,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(posts);
	});

});

route.post('/api/eventpost/:id/person',isAuthenticated,function(req,res,next){
	eventPostController.addPeople(req.user,req.params.id,function(model,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(model);
	});
});

route.delete('/api/eventpost/:id/person/:pid',isAuthenticated,function(req,res,next){
	eventPostController.removePeople(req.user,req.params.id,function(model,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(model);
	});
});

route.put('/api/eventpost/:id',isAuthenticated,function(req,res){
	eventPostController.update(req.user,req.params.id,{extraPeople:req.body.peopleInvited},{},function(model,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(model);
	});
});

route.get('/api/post/:id',isAuthenticated,function(req,res){	
	postController.getById(req.params.id,function(posts,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(posts);
	});

});

route.post('/api/eventpost',isAuthenticated,function(req,res){
	eventPostController.create(req.user,req.body,(function(post,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(post);
	}));	
});

route.delete('/api/post/:id',isAuthenticated,function(req,res){
	postController.delete(req.user,req.params.id,function(response,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send({success:true});
	});
});

route.post('/api/post/:postid/comment',isAuthenticated,function(req,res){
	postController.addComment(req.user,req.params.postid,req.body.commentText,function(comment,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(comment);
	});
});

route.delete('/api/post/:postid/comment/:id',isAuthenticated,function(req,res){
	postController.removeComment(req.user,req.params.postid,req.params.id,function(response,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send({success:true});
	});
});

route.post('/api/post/:postid/like',isAuthenticated,function(req,res){
	postController.addLike(req.user,req.params.postid,function(like,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(like);
	});
});

route.delete('/api/post/:postid/like/:id',isAuthenticated,function(req,res){
	postController.removeLike(req.user,req.params.postid,function(response,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send({success:true});
	});
});

route.post('/api/post/:postid/dislike',isAuthenticated,function(req,res){
	postController.addDislike(req.user,req.params.postid,function(dislike,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(dislike);
	});
});

route.delete('/api/post/:postid/dislike/:id',isAuthenticated,function(req,res){
	postController.removeDislike(req.user,req.params.postid,function(response,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send({success:true});
	});
});

///////////////////////

route.post('/api/post/:postid/comment/:commentid/like',isAuthenticated,function(req,res){
	postController.addCommentLike(req.user,req.params.postid,req.params.commentid,function(like,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(like);
	});
});

route.delete('/api/post/:postid/comment/:commentid/like/:id',isAuthenticated,function(req,res){
	postController.removeCommentLike(req.user,req.params.postid,req.params.commentid,function(response,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send({success:true});
	});
});

route.post('/api/post/:postid/comment/:commentid/dislike',isAuthenticated,function(req,res){
	postController.addCommentDislike(req.user,req.params.postid,req.params.commentid,function(dislike,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send(dislike);
	});
});

route.delete('/api/post/:postid/comment/:commentid/dislike/:id',isAuthenticated,function(req,res){
	postController.removeCommentDislike(req.user,req.params.postid,req.params.commentid,function(response,error){
		if(error){
			res.status(302).send(error);
		}
		res.status(200).send({success:true});
	});
});

// route.get('/event/create',isAuthenticated,function(req,res){
// 	var post = new EventPost({
// 		text:'My first event',
// 		from:req.user._id,
// 		createdAt:Date.now(),
// 		updatedAt:Date.now(),
// 		likes:[req.user._id],
// 		dislikes:[req.user._id],
// 		eventDate:Date.now(),
// 		comments:[{
// 			commentText:'First comment',
// 			from:req.user._id,
// 			createdAt:Date.now(),
// 			likes:[req.user._id],
// 			dislikes:[req.user._id],
// 		}]
// 	});
// 	post.save(function(error){
// 		if(error)
// 			res.send("Event could not be created");
// 		else{
			
// 			res.send("created event");
// 		}
// 	});
	
// });

// route.get('/post',isAuthenticated,function(req,res){
	
// 	TextPost.find(function(err,users){
// 		TextPost.populate(users,[{path:'comments.from',model:'users',select:'local.email'},{path:'from',model:'users',select:'local.email'}],function(err,resPost){
// 			if(err){
// 				console.log(err);
// 				res.send('Post created but not fetched');
// 			}
// 			else{
// 				res.send(resPost);
// 			}
// 		});
// 	});

// });

// route.get('/post/delete/:id',isAuthenticated,function(req,res){
// 	postController.delete(req.user,req.params.id,function(result){
// 		res.send(result);
// 	})
// });

// route.get('/post/addComment/:id',isAuthenticated,function(req,res){
// 	postController.addComment(req.user,req.params.id,'my added comment',function(result){
// 		res.send(result);
// 	})
// });

// route.get('/post/removeComment/:postId/:commentId',isAuthenticated,function(req,res){
// 	postController.removeComment(req.user,req.params.postId,req.params.commentId,function(result){
// 		res.send(result);
// 	})
// });

// route.get('/post/addLike/:postId/',isAuthenticated,function(req,res){
// 	postController.addLike(req.user,req.params.postId,function(result){
// 		res.send(result);
// 	})
// });

// route.get('/post/addDislike/:postId',isAuthenticated,function(req,res){
// 	postController.addDislike(req.user,req.params.postId,function(result){
// 		res.send(result);
// 	})
// });

// route.get('/post/addCommentLike/:postId/:commentId',isAuthenticated,function(req,res){
// 	postController.addCommentLike(req.user,req.params.postId,req.params.commentId,function(result){
// 		res.send(result);
// 	})
// });

// route.get('/post/addCommentDislike/:postId/:commentId',isAuthenticated,function(req,res){
// 	postController.addCommentDislike(req.user,req.params.postId,req.params.commentId,function(result){
// 		res.send(result);
// 	})
// });

// route.get('/post/removeCommentLike/:postId/:commentId',isAuthenticated,function(req,res){
// 	postController.removeCommentLike(req.user,req.params.postId,req.params.commentId,function(result){
// 		res.send(result);
// 	})
// });

// route.get('/post/removeCommentDislike/:postId/:commentId',isAuthenticated,function(req,res){
// 	postController.removeCommentDislike(req.user,req.params.postId,req.params.commentId,function(result){
// 		res.send(result);
// 	})
// });
function isAuthenticated(req,res,next){
	if(req.isAuthenticated())
		return next();	
	res.redirect('/login');
}

module.exports = route;