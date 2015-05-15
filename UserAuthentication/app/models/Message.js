var mongoose = require('../mongodb/dbConnection');
var messageSchema = require('../mongodb/messageSchema');

module.exports = mongoose.model('message',messageSchema);

