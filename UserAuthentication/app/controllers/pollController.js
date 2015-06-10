var Poll = require('../models/Poll');
var _  = require('underscore');

module.exports = {
	get:function(user,filter,callback){
		var qry = Poll.find({$or:[{candidates:{$all:user.friends}},{candidates:user._id}]});
		qry.exec(function(err,res){
			if(err!=null){
				callback(null,err);
			}
			var results = [];
			_.each(res,function(poll){
				results.push(poll.results);
			})
			callback(results,null);
		});
	},
	getById:function(user,id,callback){
		var qry = Poll.findOne({$and:[
			{_id:id},{$or:[{candidates:{$all:user.friends}},{candidates:user._id}]}
			]});
		qry.execute(function(err,res){
			if(err!=null){
				callback(null,err);
			}
			callback(res.results,null);
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
			callback(model.results,null);
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
	addVote:function(user,id,userVotes,callback){
		var uniqueList = _.uniq(userVotes);
		if(uniqueList.length!=userVotes.length){
			callback(null,{errorMessage:'Ranking needs to be unique'});
		}
		this.getById(user,id,function(res,err){
			if(err!=null){
				callback(null,err);
			}
			_.each(res.votes,function(vote){
				var userVote = _.where(vote.votes,{from:user._id})
				if(userVote.length>0){
					callback(null,{errorMessage:'User has already Voted'});
				}
			});
			_.each(userVotes,function(value, index) {
				if(res.candidates.indexOf(value)<0){
					callback(null,{errorMessage:'Invalid Vote'});
				}
				var rank = res.candidates.length-index;
				candidateVote = _.findWhere(res.votes,{candidate:value});
				if(candidateVote){					
					candidateVote.votes.push({from:user._id,rank:rank})
				}else{
					candidateVote = {candidate:value,votes:[{from:user._id,rank:rank}]};
					res.votes.push(candidateVote);
				}
			});
			res.save(function(error,successObj){
				if(err!=null){
					callback(null,err);
				}
				callback(res.results,null);
			});
		});
	}
}

