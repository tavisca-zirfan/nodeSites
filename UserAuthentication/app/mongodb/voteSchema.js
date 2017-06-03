var mongoose = require('mongoose');

var voteStructureSchema = mongoose.Schema({
	from:{type:mongoose.Schema.ObjectId,ref:'users'},
	rank:Number
});

var voteSchema = mongoose.Schema({
	candidate: {type:mongoose.Schema.ObjectId,ref:'users'},
	votes:[voteStructureSchema]
});

module.exports = voteSchema;

