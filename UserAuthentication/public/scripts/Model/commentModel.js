window.friends.Model.Comment = window.friends.Model.PostLike.extend({
    defaults: {
        postType: 'Comment'
    },
    urlRoot: '/api/comment'
});

window.friends.Collection.Comment = Backbone.Collection.extend({
    model: friends.Model.Comment,
    parse: function (results) {
        if(results.items)
            return results.items;
        else {
            return results;
        }
    },
    url:'/api/comment'
})