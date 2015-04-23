var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/friends");

var UserSchema = new mongoose.Schema({
	name:String,
	password:String
},{
	collection:'credentials'
});

module.exports = mongoose.model('credentials',UserSchema);