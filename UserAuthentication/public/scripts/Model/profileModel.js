window.friends.Model.Profile = Backbone.Model.extend({

});

window.friends.Collection.Profile = Backbone.Collection.extend({
    model: friends.Model.Profile,
    parse:function(response) {
        return response.items;
    },
    url: 'api/profile/',
    getFriends: function () {
        var that = this;
        $.ajax({
            url: '/webapi/profile/GetFriends',
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
})