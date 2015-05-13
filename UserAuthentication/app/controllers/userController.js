var User = require('../models/User');
var https = require('https');


function createProfile(user,userVM){

}

module.exports = {
	createLocal:function(localuser,callback){
		var newUser = new User();
		newUser.local = {
			email:localuser.email,
			password:localuser.password,
		};
		newUser.profile = localuser.profile;
		newUser.save(function(error){
			callback(newUser,error);
		});
	},
	getLocal:function(email,callback){
		User.findOne({'local.email':email},function(error,user){
			if(error)
				callback(null,error);
			else
				callback(user,null);
		});
	},
	getById:function(caller,userId,callback){
		// if(caller._id == userId || caller.friends.indexOf(userId)>-1){
			User.findOne({'_id':userId},function(error,user){
				if(error)
					callback(null,error);
				else
					callback(user,null);
			});
		// }else{
		// 	callback(null,{message:'User does not have sufficient rights'})
		// }
	},
	getOrCreateFacebook:function(token,profile,callback){
		User.findOne({'facebook.profileId':profile.id},function(error,user){
			if(error)
				callback(null,error);
			else if(user)
				callback(user,null);
			else{
				var newUser = new User();
				newUser.facebook = {
					profileId:profile.id,
					token:token,
					email:profile.emails[0].value
				};
				var fields = ['id','birthday','about','first_name','middle_name','last_name','picture.width(800).height(800)']
				var options = {
				    host: 'graph.facebook.com',
				    path: '/me?access_token=' + token + '&fields='+fields.join(',')
				};

				https.get(options,function(response){
					var responseString = '';
				    response.on('data', function(data) {
				      responseString += data;
				    });

				    response.on('end', function() {
				    	var res = JSON.parse(responseString);
				    	console.log(res);
					    newUser.profile = {
					    	name:{
					    		firstName : res.first_name,
					    		middleName:res.middle_name,
					    		lastName:res.last_name
					    	},
					    	gender:profile.gender,
					    	dob: res.birthday,
					    	about:res.about
					    };
					    newUser.verified=true;
					    if(res.picture){					    	
					    	newUser.profile.imageUrl = res.picture.data.url;
					    	newUser.markModified('profile');
					    }
					    newUser.save(function(error){
					    	if(error)
					    		callback(null,error);
					    	else
					    		callback(newUser,error);
					    });
				    });
					
				});
			}
		});
	},
	update:function(query,updates,options,callback){
		User.update(query,updates,options,callback);
	},
	getAll:function(qry,filter,list,paging,callback){
		var query = qry||{};
		if(filter.name){
			query["$or"] = [{'firstName' : new RegExp(filter.name, 'i')},{'middleName' : new RegExp(filter.name, 'i')},{'lastName' : new RegExp(filter.name, 'i')}];
		}
		var userQuery = User.find(query);
		if(list){
			userQuery.where('_id').in(list);
		}
		if(!paging.all){
			userQuery.skip((paging.pageNumber-1)*10).limit(paging.recordsPerPage);
		}
		userQuery.select('profile friends accountInfo');
		userQuery.exec(function(error,users){
			if(error)
				callback(null,error);
			callback(users,null);
		});
	}
}
