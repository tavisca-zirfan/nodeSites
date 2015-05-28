var Poll = require('../models/Poll');

module.exports = {
	get:function(user,filter,callback){
		var qry = Poll.find({candidates:{$all:user.friends}});
		qry.execute(function(err,res){
			if(err!=null){
				callback(null,err);
			}
			callback(res,null);
		});
	},
	getById:function(user,id,callback){
		var qry = Poll.findOne({_id:id,candidates:{$all:user.friends}});
		qry.execute(function(err,res){
			if(err!=null){
				callback(null,err);
			}
			callback(res,null);
		});
	},
	create:function(user,poll,callback){
		var poll = new Poll(poll);
		poll.author = user._id;
		poll.createdAt = Date.now();
		poll.save(function(error,model){
			if(error!=null){
				callback(null,error);
			}
			callback(model,null);
		});
	},
	delete:function(user,id,callback){
		Poll.find({_id:id,author:user._id}).remove(function(error,res){
			if(error!=null){
				callback(null,error);
			}
			callback(res,null);
		});
	},
	addVote:function(user,id,candidateRanking,callback){
		Poll.find
	}
}