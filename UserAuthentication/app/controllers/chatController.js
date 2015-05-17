var users = {};
var Message = require('../models/Message');
var messageController = require('../controllers/messageController');
var _ = require('underscore');

module.exports = function(io){	
	io.sockets.on('connection',function(socket){
		console.log('a user connected');

		var user = socket.conn.request.user;
		if(!users[user._id])
			users[user._id] = [socket.id]
		else{
			users[user._id].push(socket.id);
		}
		socket.on('message-server',function(messageData){
			if(users[messageData.to]){
				messageData.deliveredAt = Date.now();
			}
			messageController.create(user,messageData,function(message,error){
				if(error){
					io.to(socket.id).emit('error',message);
				}else{
					var socketsToBeMessageSent = users[messageData.to];
					if(socketsToBeMessageSent && socketsToBeMessageSent.length>0) {
						_.each(socketsToBeMessageSent,function(socketId){
							io.to(socketId).emit('message-client',message);
						});
					}
					var socketsOfOwner = users[user._id];
					if(socketsOfOwner && socketsOfOwner.length>0) {
						_.each(socketsOfOwner,function(socketId){
							io.to(socketId).emit('message-client',message);
						});
					}
				}
			});
			
		});

		socket.on('disconnect',function(){
			var socketsOfOwner = users[user._id];
			users[user._id] = _.without(socketsOfOwner,socket.id);
			if(users[user._id].length == 0){
				users[user._id] = null;
			}
		});

	});
}