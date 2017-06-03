var mongoose = require('mongoose');
var textPostSchema = require('../mongodb/textPostSchema');
var extend = require('mongoose-schema-extend');

var eventPostSchema = textPostSchema.extend({
	eventDate:Date
});

module.exports = eventPostSchema;