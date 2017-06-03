var mongoose = require('mongoose');
var interestSchema = new mongoose.Schema({
	display_name:String,
	url:String,
	pic:String,
	about:String
},{
	collection:'interests'
});

module.exports = interestSchema;