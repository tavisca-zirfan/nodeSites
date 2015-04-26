var mongoose = require('../mongodb/dbConnection');
var UserSchema = require('../mongodb/userSchema');
// var UserSchema = new mongoose.Schema({
// 	name:String,
// 	password:String
// },{
// 	collection:'credentials'
// });

module.exports = mongoose.model('users',UserSchema);