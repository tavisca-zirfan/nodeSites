window.friends.Model.Comment = Backbone.Model.extend({

});

window.friends.Collection.Comment = Backbone.Collection.extend({
    model: friends.Model.Comment,    
    url:function(){
        var baseUrl = this.parent.url()+this.parent.id+'/'
        return baseUrl+'comment/';
    }
})