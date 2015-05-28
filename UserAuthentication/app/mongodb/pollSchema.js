var mongoose = require('mongoose');
var voteSchema = require('../mongodb/voteSchema');

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

module.exports = pollSchema;