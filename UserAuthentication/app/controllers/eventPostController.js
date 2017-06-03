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
	update:function(query,updates,options,callback){
		User.update(query,updates,options,callback);
	},
}