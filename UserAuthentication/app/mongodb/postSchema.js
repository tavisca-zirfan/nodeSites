var mongoose = require('mongoose');
var commentSchema = require('../mongodb/commentSchema');
var extend = require('mongoose-schema-extend');

var postSchema = mongoose.Schema({
	text:String,
	from:{type:mongoose.Schema.ObjectId,ref:'users'},
	to:{type:mongoose.Schema.ObjectId,ref:'users'},
	createdAt:Date,
	updatedAt:Date,
	likes:[{type:mongoose.Schema.ObjectId,ref:'users',unique:true}],
	dislikes:[{type:mongoose.Schema.ObjectId,ref:'users',unique:true}],
	comments:[commentSchema],
	noOfComments:Number
},{
	collection:'posts',
	discriminatorKey:'_type'
});

postSchema.path('noOfComments').set(function(value){
	return this.comments.length;
});

module.exports = postSchema;