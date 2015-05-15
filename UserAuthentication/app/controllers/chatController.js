var users = {};
var Message = require('../models/Message');
var messageController = require('../controllers/messageController');
var _ = require('underscore');

module.exports = function(req){
	if(req.isAuthenticated()){
		var io = req.io;
		io.sockets.once('connection',function(socket){
			console.log('a user connected');
			if(!users[req.user._id])
				users[req.user._id] = [socket.id]
			else{
				users[req.user._id].push(socket.id);
			}
			socket.on('message-server',function(messageData){
				
				messageController.create(req.user,messageData.to,messageData.message,function(message,error){
					if(error){
						io.to(socket.id).emit('error',"message could not be created");
					}else{
						var socketsToBeMessageSent = users[messageData.to];
						if(socketsToBeMessageSent && socketsToBeMessageSent.length>0) {
							_.each(socketsToBeMessageSent,function(socketId){
								io.to(socketId).emit('message-client',message);
							})
						}
						var socketsOfOwner = users[req.user._id];
						if(socketsOfOwner && socketsOfOwner.length>0) {
							_.each(socketsOfOwner,function(socketId){
								io.to(socketId).emit('message-client',message);
							})
						}
					}
				});
				
			});

			socket.on('disconnect',function(){
				var socketsOfOwner = users[req.user._id];
				users[req.user._id] = _.without(socketsOfOwner,socket.id);
				if(users[req.user._id].length == 0){
					users[req.user._id] = null;
				}
			});

		});
	}
}