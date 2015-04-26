var mongoose = require('mongoose');
var interestSchema = require('../mongodb/interestSchema');

var userSchema = new mongoose.Schema({
	local:{
		email:{type:String,lowercase:true},
		password:String,
	},
	facebook:{
		profileId:String,
		token:String,
		email:String,
		name:String
	},
	profile:{
		name:{
			firstName:String,
			middleName:String,
			lastName:String
		},
		dob:Date,
		about:String,
		location:{
			city:String,
			state:String,
			country:String,
			geoLocation:{
				latitude:String,
				longitude:String
			}
		},
		relationship:{type:String,enum:['single','committed','not sure','committed but available','none of your business']},
		hobbies:[interestSchema],
		books:[interestSchema],
		movies:[interestSchema],
		series:[interestSchema],
		sports:[interestSchema]
	},
	verificationLink:String,
	verified:Boolean,
	friendRequestSent:[mongoose.Schema.ObjectId],
	friendRequestRecieved:[mongoose.Schema.ObjectId],
	friends:[mongoose.Schema.ObjectId]
},{
	collection:'users'
});

module.exports = userSchema;
