var mongoose = require('../mongodb/dbConnection');
var pollSchema = require('../mongodb/pollSchema');

var Poll = mongoose.model('poll',pollSchema);