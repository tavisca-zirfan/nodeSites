var mongoose = require('mongoose');
var postSchema = require('../mongodb/postSchema');
var extend = require('mongoose-schema-extend');

var textPostSchema = postSchema.extend({
});

module.exports = textPostSchema;