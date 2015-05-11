var mongoose = require('../mongodb/dbConnection');
var PostSchema = require('../mongodb/postSchema');


module.exports = mongoose.model('post',PostSchema);