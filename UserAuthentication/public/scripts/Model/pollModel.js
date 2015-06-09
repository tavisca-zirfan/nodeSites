
window.friends.Model.Poll = Backbone.Model.extend({
    idAttribute:'_id',
    renderView:function($container) {
        this.view = new window.friends.Views.BasePostView({ model: this, $container: $container });
    }, 
    urlRoot:'/api/poll/',
    addVote:function(votes){
        var that = this;
        $.post('/api/poll/'+that.id+'/votes/',JSON.stringify({votes:votes})).done(function(response){
            that.set(response);
        }).fail(function(error){

        });
    }    
});

window.friends.Collection.Poll = Backbone.Collection.extend({
    model:friends.Model.Poll,
    url:'/api/poll/'
});