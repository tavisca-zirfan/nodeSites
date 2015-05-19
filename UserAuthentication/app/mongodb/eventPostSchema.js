var mongoose = require('mongoose');
var postSchema = require('../mongodb/postSchema');
var extend = require('mongoose-schema-extend');

var eventPostSchema = postSchema.extend({
	when:Date,
	peopleInvited:[mongoose.Schema.ObjectId],
	peopleComing:[mongoose.Schema.ObjectId],
	where:{
		place:String,
		latitude:String,
		longitude:String
	},
	name:String
});

module.exports = eventPostSchema;