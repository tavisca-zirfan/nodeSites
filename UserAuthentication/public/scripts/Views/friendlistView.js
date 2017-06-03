window.friends.Views.FriendListView = Backbone.View.extend({
    template: '#profileFriendListTemplate',
    el:".friendlist",
    initialize:function() {
        var that = this;
        if (!friends.hbTemplate.FriendListView) friends.hbTemplate.FriendListView = Handlebars.compile($(this.template).html());
        this.collection = new friends.Collection.Profile();
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch({reset:true});
        setInterval(function() {
            that.collection.fetch({reset:true});
        },300000);
    },

    render: function (profiles) {
        var that = this;
        that.$el.html('');        
        that.$el.append($(friends.hbTemplate.FriendListView({profiles:profiles.models})));        
    }

})