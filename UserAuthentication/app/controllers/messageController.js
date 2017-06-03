var Message = require('../models/Message');

module.exports = {
	get:function(user,secondUserId,filter,pagingInfo){
		query = {};
		query['$or'] = [{'$and':[{from:user._id},{to:secondUserId}]},{'$and':[{from:user._id},{to:secondUserId}]}]
		var qry = Message.find(query);

		qry.sort({createdAt:'descending'});
	},
	create:function(user,messageData,callback){
		var message = new Message({text:messageData.text,from:user._id,to:messageData.to,createdAt:Date.now(),clientid:messageData.clientid});
		if(messageData.deliveredAt){
			message.deliveredAt=messageData.deliveredAt;
		}
		message.save(function(error,model){
			if(error){
				callback(null,error);
			}
			callback(model,error);
		})
	},
	update:function(id,action,callback){
		if(action=='delivered'){
			Message.findByIdAndUpdate(id,{deliveredAt:Date.now()},{safe:true,new:true},function(err,model){
				if(err) callback(null,err);
				else callback({_id:user._id},null);
				});
		}
		else if(action=="seen"){
			Message.findByIdAndUpdate(id,{seenAt:Date.now()},{safe:true,new:true},function(err,model){
				if(err) callback(null,err);
				else callback({_id:user._id},null);
				});
		}
		else if(action=="both"){
			Message.findByIdAndUpdate(id,{deliveredAt:Date.now(),seenAt:Date.now()},{safe:true,new:true},function(err,model){
				if(err) callback(null,err);
				else callback({_id:user._id},null);
				});
		}
	}
}