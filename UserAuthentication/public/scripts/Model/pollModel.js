
window.friends.Model.Poll = Backbone.Model.extend({
    idAttribute:'_id',
    renderView:function($container) {
        this.view = new window.friends.Views.BasePostView({ model: this, $container: $container });
    }, 
    urlRoot:'/api/poll/',
    addVote:function(votes){
        var that = this;
        var data = JSON.stringify({votes:votes});
        $.ajax({
          url: '/api/poll/'+that.id+'/votes/',
          type: 'POST',
          data: data,
          contentType: 'application/json; charset=utf-8',
          dataType: 'json'
        }).done(function(response){
            that.set(response);
        }).fail(function(error){

        });
    }    
});

window.friends.Collection.Poll = Backbone.Collection.extend({
    model:friends.Model.Poll,
    url:'/api/poll/'
});