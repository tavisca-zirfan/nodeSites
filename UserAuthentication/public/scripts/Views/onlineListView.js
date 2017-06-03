window.friends.Views.OnlineListView = Backbone.View.extend({
    template: '#sideFriendTemplate',
    el:".online-list",
    initialize:function() {
        if (!friends.hbTemplate.OnlineListView) friends.hbTemplate.OnlineListView = Handlebars.compile($(this.template).html());
        var profiles = new friends.Collection.Profile();
        this.listenTo(profiles, 'sync', this.render);
        profiles.getFriends();
        setInterval(function() {
            profiles.getFriends();
        },300000);
    },

    render: function (profiles) {
        var that = this;
        that.$el.html('');
        _.forEach(profiles.models, function (model) {
            that.$el.append($(friends.hbTemplate.OnlineListView(model)));
        });
    }

})