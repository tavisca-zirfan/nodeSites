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
	update:function(id,updates,options,callback){
		var updateFields = {};
		if(updates.invitedUsers){
			updateFields['$addToSet'] = {peopleInvited:{$each:updates.invitedUsers}};
		}
		if(updates.addPeopleComing){
			if(!updateFields.$addToSet)
				updateFields.$addToSet = {};
			updateFields.$addToSet['peopleComing']=updates.addPeopleComing];
		}
		if(updates.removePeopleComing){
			updateFields.$pull = {peopleComing:updates.removePeopleComing}
		}
		EventPost.findByIdAndUpdate(id,updateFields,{safe:true,new:true},function(err,model){
			if(err){
				callback(null,err);
			}
			else{
				callback(model,null);
			}
		});
	},
}