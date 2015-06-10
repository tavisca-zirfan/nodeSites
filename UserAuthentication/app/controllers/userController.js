var User = require('../models/User');
var https = require('https');
var _ = require('underscore');


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
	getAll:function(qry,filter,list,paging,sortBy,callback){
		var query = qry||{};
		if(filter.name){
			query["$or"] = [{'profile.name.firstName' : new RegExp(filter.name, 'i')},{'profile.name.middleName' : new RegExp(filter.name, 'i')},{'profile.name.lastName' : new RegExp(filter.name, 'i')}];
		}
		var userQuery = User.find(query);
		if(list){
			userQuery.where('_id').in(list);
		}
		if(!paging.all){
			userQuery.skip((paging.pageNumber-1)*10).limit(paging.recordsPerPage);
		}
		userQuery.select('profile friends accountInfo');
		if(sortBy){
			sortProperty = {};
			sortProperty[sortBy] = 'descending'
			userQuery.sort(sortProperty);
		}
		userQuery.exec(function(error,users){
			if(error)
				callback(null,error);
			callback(users,null);
		});
	},
	addFriend:function(authUser,id,callback){
		var saveFriendship = function(user){
			user.save(function(error,user){
				if(error){
					callback(null,error);
				}
				callback({_id:id})
			});
		}
		User.findById(authUser._id,function(error,user){			
			if(error){
				callback(null,error);
			}
			User.findById(id,function(error,friend){
				if(error){
					callback(null,error);
				}
				// if the user is already added in the other person's friendlist then just update user's friendlist
				if(friend.friends.indexOf(authUser._id)>=0){
					friend.friendRequestSent.pull(user._id);
					friend.friendRequestRecieved.pull(user._id);
					friend.save(function(error,f){
						if(error){
							callback(null,error)
						}	
						user.friendRequestSent.pull(friend._id);
						user.friendRequestRecieved.pull(friend._id);
						if(user.friends.indexOf(friend._id)<0){							
							user.friends.push(friend._id);							
						}					
						saveFriendship(user);
					});						
					
				}
				// if friend request already sent
				else if(user.friendRequestSent.indexOf(id)>=0 && friend.friendRequestRecieved.indexOf(user._id)>=0)
				{
					callback(null,{errorType:'Duplicate',message:'Friend Request already sent'});
				}
				// if friend request was sent but not recieved
				else if(user.friendRequestSent.indexOf(id)>=0)
				{
					friend.friendRequestSent.pull(user._id);
					friend.friendRequestRecieved.push(user._id);
					saveFriendship(friend);
				}
				// if friend request is with the person but not on the addition list
				else if(friend.friendRequestRecieved.indexOf(id)>=0)
				{
					user.friendRequestSent.push(friend._id);
					saveFriendship(user);
				}
				// if the request is recieved from that person
				else if(user.friendRequestRecieved.indexOf(id)>=0){
					friend.friendRequestRecieved.pull(user._id);
					friend.friendRequestSent.pull(user._id);
					friend.friends.push(user._id);
					friend.save(function(error,f){
						if(error){
							callback(null,error);
						}
						user.friendRequestSent.pull(friend._id);
						user.friendRequestRecieved.pull(friend._id);
						user.friends.push(friend._id);
						saveFriendship(user);
					});
				}
				// if there has been no request from either side
				else if(friend.friendRequestRecieved.indexOf(user._id)<0){
					friend.friendRequestRecieved.push(user._id);
					friend.friendRequestSent.pull(user._id);
					friend.save(function(error,f){
						if(error){
							callback(null,error);
						}
						user.friendRequestSent.push(friend._id);
						user.friendRequestRecieved.pull(friend._id);
						saveFriendship(user);
					});
				}				
				
			});			
		});
	},
	removeFriend:function(authUser,id,callback){
		User.findByIdAndUpdate(id,{$pull:{"friends":authUser._id}},
			{safe:true,new:true},function(err,model){
			if(err) callback(null,err);
			User.findByIdAndUpdate(authUser._id,{$pull:{"friends":id}},
				{safe:true,new:true},function(err,model){
				if(err) callback(null,err);				
				else callback({_id:id},null);
			});
		});
	}
}
