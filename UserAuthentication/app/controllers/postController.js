var Post = require('../models/Post');

module.exports={
	delete:function(user,id,callback){
		Post.find({$and:[{_id:id},{$or:[{from:user._id},{to:user._id}]}]}).remove(function(error){
			if(error)
				callback(false);
			else
				callback(true);
		});
	},
	addComment:function(user,postId,comment,callback){
		var comment = {commentText:comment,from:user._id,createdAt:Date.now(),likes:[],dislikes:[]};
		Post.findByIdAndUpdate(postId,{$push:{"comments":comment},$set:{updatedAt:Date.now()}},{safe:true,new:true},function(err,model){
			callback(model.comments[model.comments.length-1]);
		});
	},
	removeComment:function(user,postId,commentId,callback){
		Post.update({$and:[{_id:postId},{$or:[{from:user._id},{to:user._id},{$and:[{'comments._id':commentId},{'comments.from':user._id}]}]}]},{$pull:{"comments":{$and:[{_id:commentId},{from:user._id}]}}},function(err,model){
			callback(model);
		});
	},
	addLike:function(user,postId,callback){
		Post.findByIdAndUpdate(postId,{$pull:{"dislikes":user._id},$push:{"likes":user._id}},{safe:true,new:true},function(err,model){
			callback(model);
		});
	},
	removeLike:function(user,postId,callback){
		Post.findByIdAndUpdate(postId,{$pull:{"likes":user._id}},{safe:true,new:true},function(err,model){
			callback(model);
		});
	},
	addDislike:function(user,postId,callback){
		Post.findByIdAndUpdate(postId,{$pull:{"likes":user._id},$push:{"dislikes":user._id}},{safe:true,new:true},function(err,model){
			callback(model);
		});
	},
	removeDislike:function(user,postId,callback){
		Post.findByIdAndUpdate(postId,{$pull:{"dislikes":user._id}},{safe:true,new:true},function(err,model){
			callback(model);
		});
	},
	addCommentLike:function(user,postId,commentId,callback){
		Post.update({_id:postId,'comments._id':commentId},
			{$pull:{"comments.$.dislikes":user._id},$push:{"comments.$.likes":user._id}},
			{safe:true,new:true},function(err,model){
			if(err)callback(err)
				else
			callback(model);
		});
	},
	removeCommentLike:function(user,postId,commentId,callback){
		Post.update({_id:postId,'comments._id':commentId},
			{$pull:{"comments.$.likes":user._id}},
			{safe:true,new:true},function(err,model){
			if(err)callback(err)
				else
			callback(model);
		});
	},
	addCommentDislike:function(user,postId,commentId,callback){
		Post.update({_id:postId,'comments._id':commentId},
			{$pull:{"comments.$.likes":user._id},$push:{"comments.$.dislikes":user._id}},
			{safe:true,new:true},function(err,model){
			if(err)callback(err)
				else
			callback(model);
		});
	},
	removeCommentDislike:function(user,postId,commentId,callback){
		Post.update({_id:postId,'comments._id':commentId},
			{$pull:{"comments.$.dislikes":user._id}},
			{safe:true,new:true},function(err,model){
			if(err)callback(err)
				else
			callback(model);
		});
	}
}