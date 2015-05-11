var mongoose = require('mongoose');
var postSchema = require('../mongodb/postSchema');
var extend = require('mongoose-schema-extend');

var eventPostSchema = postSchema.extend({
	eventDate:Date
});

module.exports = eventPostSchema;