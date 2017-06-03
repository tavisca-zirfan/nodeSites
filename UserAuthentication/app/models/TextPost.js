var mongoose = require('../mongodb/dbConnection');
var TextPostSchema = require('../mongodb/textPostSchema');


module.exports = mongoose.model('textPost',TextPostSchema);