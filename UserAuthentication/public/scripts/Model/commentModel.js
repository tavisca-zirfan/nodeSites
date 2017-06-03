window.friends.Model.Comment = Backbone.Model.extend({
    idAttribute:'_id',
    relations:{
        likes:friends.Collection.Likes,
        dislikes:friends.Collection.Dislikes
    },
    parse:function(model){
        if(!model.likes) model.likes=[];
        if(!model.dislikes) model.dislikes=[];
        return model;
    }
});

window.friends.Collection.Comment = Backbone.Collection.extend({
    model: friends.Model.Comment,    
    url:function(){
        var baseUrl = this.parent.url()+'/'
        return baseUrl+'comment/';
    }
})