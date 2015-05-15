var Message = require('../models/Message');

module.exports = {
	get:function(user,secondUserId,filter,pagingInfo){
		query = {};
		query['$or'] = [{'$and':[{from:user._id},{to:secondUserId}]},{'$and':[{from:user._id},{to:secondUserId}]}]
		var qry = Message.find(query);

		qry.sort({createdAt:'descending'});
	},
	create:function(user,toUserId,textMessage,callback){
		var message = new Message({text:'text',from:user._id,to:toUserId,createdAt:Date.now()});
		message.save(function(error,model){
			if(error){
				callback(null,error);
			}
			callback(model,error);
		})
	}
}