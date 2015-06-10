window.friends.Model.Friend = Backbone.Model.extend({
    idAttribute:'_id',
    parse:function(model){
        if(typeof model == "object"){
            return model;
        }else if(typeof model == "string"){
            return {_id:model};
        }else{
            return {model:model};
        }
    }
});

window.friends.Collection.Friend = Backbone.Collection.extend({
    model: friends.Model.Friend,    
    url:function(){
        var baseUrl = this.parent.url()+'/'
        return baseUrl+'friend/';
    }
})