window.friends.Model.Profile = Backbone.Model.extend({
    idAttribute:'_id',
    urlRoot:'/api/profile/'
});

window.friends.Collection.Profile = Backbone.Collection.extend({
    model: friends.Model.Profile,
    url: '/api/profile/'
    
});