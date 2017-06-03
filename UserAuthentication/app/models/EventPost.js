var mongoose = require('../mongodb/dbConnection');
var EventPostSchema = require('../mongodb/eventPostSchema');


module.exports = mongoose.model('eventPost',EventPostSchema);