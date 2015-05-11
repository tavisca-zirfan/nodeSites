var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	commentText:String,
	from:{type:mongoose.Schema.ObjectId,ref:'users'},
	createdAt:Date,
	likes:[{type:mongoose.Schema.ObjectId,ref:'users'}],
	dislikes:[{type:mongoose.Schema.ObjectId,ref:'users'}]
},{
	collection:'comments'
});

module.exports = commentSchema;