var TextPost = require('../models/TextPost');

module.exports={
	create:function(user,textPost,callback){
		var post = new TextPost(textPost);
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