var mongoose = require('mongoose');
var dbConfig = require('../../config/database');

mongoose.connect(dbConfig.url);

module.exports = mongoose;

