var EventPost = require('../models/EventPost');

module.exports={
	create:function(user,eventPost,callback){
		var post = new EventPost(eventPost);
		post.from = user._id;
		post.createdAt=Date.now();
		post.updatedAt=Date.now();
		post.likes=[];
		post.dislikes=[];
		post.comments=[];
		post.save(function(error,post){
			if(error){
				callback(null,error); 
			}else{
				callback(post,null);
			}
		})
	},
	update:function(user,id,updates,options,callback){
		EventPost.update({_id:id,from:user._id},{$addToSet:{peopleInvited:{$each:updates.extraPeople}}},{safe:true,new:true},function(err,model){
			if(err){
				callback(null,err); 
			}else{
				callback(model,null);
			}
		})
	},
	addPeople:function(user,id,callback){		
		
		EventPost.update({$and:[{_id:id},{peopleInvited:user._id}]},{$addToSet:{peopleComing:user._id}},{safe:true,new:true},function(err,model){
			if(err){
				callback(null,err);
			}
			else{
				callback({id:user._id},null);
			}
		});
	},
	removePeople:function(user,id,callback){
		var updateFields = {};		
		EventPost.findByIdAndUpdate(id,{$pull:{peopleComing:user._id}},{safe:true,new:true},function(err,model){
			if(err){
				callback(null,err);
			}
			else{
				callback(model,null);
			}
		});
	}
}