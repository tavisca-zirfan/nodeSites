window.friends.Model.Profile = Backbone.Model.extend({
    idAttribute:'_id',
    urlRoot:'/api/profile/',
    parse:function(model){
    	if(!model.friends) model.friends = [];
    	if(!model.friendRequestSent) model.friendRequestSent = [];
    	if(!model.friendRequestRecieved) model.friendRequestRecieved = [];
    	return model;
    },
    relations:{
    	friends : friends.Collection.Friend,
    	friendRequestRecieved : friends.Collection.Friend,
    	friendRequestSent : friends.Collection.Friend,
    }
});

window.friends.Collection.Profile = Backbone.Collection.extend({
    model: friends.Model.Profile,
    url: '/api/profile/'
    
});