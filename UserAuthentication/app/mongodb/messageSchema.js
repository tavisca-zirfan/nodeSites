var mongoose = require('mongoose');

var messageSchema = new mongoose.Schema({
	text:String,
	from:{type:mongoose.Schema.ObjectId,ref:'users'},
	to:{type:mongoose.Schema.ObjectId,ref:'users'},
	createdAt:Date
},{
	collection:'messages',
});

module.exports = messageSchema;