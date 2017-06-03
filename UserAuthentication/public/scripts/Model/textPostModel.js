

window.friends.Collection.TextPost = Backbone.Collection.extend({
    model: friends.Model.TextPost,
    parse: function (result) {
        return result;
    },
    url: '/api/textpost'
});