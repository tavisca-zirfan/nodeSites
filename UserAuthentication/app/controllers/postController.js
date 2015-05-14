var Post = require('../models/Post');

module.exports={
	delete:function(user,id,callback){
		Post.find({$and:[{_id:id},{$or:[{from:user._id},{to:user._id}]}]}).remove(function(error,res){
			if(error)
				callback(null,error);
			else
				callback(res,null);
		});
	},
	get:function(filter,callback){		
		var query = {};
		if(filter.userId){
			query['$or'] = [{from:filter.userId},{to:filter.userId}];
		}
		var postQry = Post.find(query).populate([{path:'comments.from',model:'users',select:'profile.name profile.imageUrl'},{path:'from',model:'users',select:'profile.name profile.imageUrl'},{path:'to',model:'users',select:'profile.name profile.imageUrl'}]);
			//postQry.select({comments:{$slice:1}})
			if(filter.lastUpdate){
				postQry.where('updatedAt').gte(filter.lastUpdate)
			}
			postQry.exec(function(err,resPost){
			if(err){
				callback(null,err)
			}
			else{
				callback(resPost,null);
			}
		});		
	},
	getById:function(id,callback){		
		Post.findById(id).populate([{path:'comments.from',model:'users',select:'profile.name profile.imageUrl'},{path:'from',model:'users',select:'profile.name profile.imageUrl'},{path:'to',model:'users',select:'profile.name'}],function(err,resPost){
			if(err){
				callback(null,err)
			}
			else{
				callback(resPost,null);
			}
		});		
	},
	addComment:function(user,postId,comment,callback){
		var comment = {commentText:comment,from:user._id,createdAt:Date.now(),likes:[],dislikes:[]};
		Post.findByIdAndUpdate(postId,{$push:{"comments":comment},$set:{updatedAt:Date.now()}},{safe:true,new:true},function(err,model){
			if(err) callback(null,err)
			callback(model.comments[model.comments.length-1],err);
		});
	},
	removeComment:function(user,postId,commentId,callback){
		Post.update({$and:[{_id:postId},{$or:[{from:user._id},{to:user._id},{$and:[{'comments._id':commentId},{'comments.from':user._id}]}]}]},{$pull:{"comments":{$and:[{_id:commentId},{from:user._id}]}}},function(err,model){
			if(err) callback(null,err);
			else callback(model,null);
		});
	},
	addLike:function(user,postId,callback){
		Post.findByIdAndUpdate(postId,{$pull:{"dislikes":user._id},$addToSet:{"likes":user._id}},{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			else callback({_id:user._id},null);
		});
	},
	removeLike:function(user,postId,callback){
		Post.findByIdAndUpdate(postId,{$pull:{"likes":user._id}},{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			else callback(model,null);
		});
	},
	addDislike:function(user,postId,callback){
		Post.findByIdAndUpdate(postId,{$pull:{"likes":user._id},$addToSet:{"dislikes":user._id}},{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			else callback({_id:user._id},null);
		});
	},
	removeDislike:function(user,postId,callback){
		Post.findByIdAndUpdate(postId,{$pull:{"dislikes":user._id}},{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			else callback(model,null);
		});
	},
	addCommentLike:function(user,postId,commentId,callback){
		Post.update({_id:postId,'comments._id':commentId},
			{$pull:{"comments.$.dislikes":user._id},$addToSet:{"comments.$.likes":user._id}},
			{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			else callback({_id:user._id},null);
		});
	},
	removeCommentLike:function(user,postId,commentId,callback){
		Post.update({_id:postId,'comments._id':commentId},
			{$pull:{"comments.$.likes":user._id}},
			{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			else callback(model,null);
		});
	},
	addCommentDislike:function(user,postId,commentId,callback){
		Post.update({_id:postId,'comments._id':commentId},
			{$pull:{"comments.$.likes":user._id},$addToSet:{"comments.$.dislikes":user._id}},
			{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			else callback({_id:user._id},null);
		});
	},
	removeCommentDislike:function(user,postId,commentId,callback){
		Post.update({_id:postId,'comments._id':commentId},
			{$pull:{"comments.$.dislikes":user._id}},
			{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			else callback(model,null);
		});
	}
}