var mongoose = require('mongoose');
var interestSchema = require('../mongodb/interestSchema');

var userSchema = new mongoose.Schema({
	local:{
		email:{type:String,lowercase:true},
		password:String
	},
	facebook:{
		profileId:String,
		token:String,
		email:String
	},
	profile:{
		name:{
			firstName:String,
			middleName:String,
			lastName:String
		},
		history:{
			school:String,
			schoolLocation:String,
			college:String,
			collegeLocation:String,			
		},
		status:String,
		perfectDate:String,
		perfectFriend:String,
		dob:Date,
		about:String,		
		imageUrl:String,
		location:{
			city:String,
			state:String,
			country:String,
			geoLocation:{
				latitude:String,
				longitude:String
			}
		},
		gender:{type:String,enum:['male','female']},
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
	friends:[mongoose.Schema.ObjectId],
	accountInfo:{
		joined:Date,
		lastSeen:Date,
		frequency:Number
	}
},{
	collection:'users',
	strict:true,
});

module.exports = userSchema;
