var mongoose = require('mongoose');
var commentSchema = require('../mongodb/commentSchema');
var extend = require('mongoose-schema-extend');

var textPostSchema = mongoose.Schema({
	text:String,
	from:{type:mongoose.Schema.ObjectId,ref:'users'},
	to:{type:mongoose.Schema.ObjectId,ref:'users'},
	createdAt:Date,
	updatedAt:Date,
	likes:[{type:mongoose.Schema.ObjectId,ref:'users'}],
	dislikes:[{type:mongoose.Schema.ObjectId,ref:'users'}],
	comments:[commentSchema]
},{
	collection:'posts',
	discriminatorKey:'_type'
});

module.exports = textPostSchema;