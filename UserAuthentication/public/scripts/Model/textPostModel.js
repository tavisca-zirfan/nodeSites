window.friends.Model.TextPost = friends.Model.Post.extend({
    defaults: {
        //postType: 'PostText'
    },
    renderView: function ($container) {
        this.view = new window.friends.Views.TextPostView({ model: this, $container: $container });
    },
    methodUrl: {
        'create': '/api/textpost/'
    },

    sync: function(method, model, options) {
        if (model.methodUrl && model.methodUrl[method.toLowerCase()]) {
            options = options || {};
            options.url = model.methodUrl[method.toLowerCase()];
        }
        Backbone.sync(method, model, options);
    }
});

window.friends.Collection.TextPost = Backbone.Collection.extend({
    model: friends.Model.TextPost,
    parse: function (result) {
        return result;
    },
    url: '/api/textpost'
});