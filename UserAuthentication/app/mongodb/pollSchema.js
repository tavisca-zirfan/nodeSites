var mongoose = require('mongoose');
var voteSchema = require('../mongodb/voteSchema');
var _ = require('underscore');

var pollSchema = mongoose.Schema({
	question:String,
	author:{type:mongoose.Schema.ObjectId,ref:'users'},
	createdAt:Date,
	closingDate:Date,
	gender:String,
	candidates:[{type:mongoose.Schema.ObjectId,ref:'users',unique:true}],
	votes:[voteSchema]
},{
	collection:'polls'
});

pollSchema.virtual('results')
	.get(function(){
		var results = [];
		_.each(this.votes,function(vote){
			var points = 0;
			_.each(vote.votes,function(userVote, index) {
				points+=userVote.rank;
			});
			var result = {candidate:vote.candidate,points:points};
			results.push(result);			
		});
		return {_id:this.id,question:this.question,gender:this.gender,candidates:this.candidates,results:results};
	})

module.exports = pollSchema;