window.friends.Model.Profile = Backbone.Model.extend({
    urlRoot:'/api/profile/'
});

window.friends.Collection.Profile = Backbone.Collection.extend({
    model: friends.Model.Profile,
    url: 'api/profile/',
    getFriends: function () {
        var that = this;
        $.ajax({
            url: '/api/profile/getfriends',
            type: 'Get'
        }).done(function(response) {
            response.items.forEach(function (item, index) {
                that.reset();
                var model = new friends.Model.Profile(item);
                that.add(model);
            });
            that.trigger('sync', that);
        });
    }
});