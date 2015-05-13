window.friends.Model.Post = Backbone.Model.extend({
    idAttribute:'_id',
    renderView:function($container) {
        this.view = new window.friends.Views.BasePostView({ model: this, $container: $container });
    },
    relations: {
        comments: window.friends.Collection.Comment,
        likes:friends.Collection.Likes,
        dislikes:friends.Collection.Dislikes
    },
    parse:function(model) {
        if (!model.comments) model.comments = [];
        if (!model.likes) model.likes = [];
        if (!model.dislikes) model.dislikes = [];
        return model;
    },
    urlRoot:'/api/post/',
    
});

window.friends.Model.TextPost = friends.Model.Post.extend({
    idAttribute:'_id',
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
    model:friends.Model.TextPost,
    url:'/api/textpost/'
});

window.friends.Model.EventPost = friends.Model.Post.extend({
    idAttribute:'_id',
    defaults: {
        //postType: 'PostText'
    },
    renderView: function ($container) {
        this.view = new window.friends.Views.TextPostView({ model: this, $container: $container });
    },
    methodUrl: {
        'create': '/api/eventpost/'
    },

    sync: function(method, model, options) {
        if (model.methodUrl && model.methodUrl[method.toLowerCase()]) {
            options = options || {};
            options.url = model.methodUrl[method.toLowerCase()];
        }
        Backbone.sync(method, model, options);
    }
});



window.friends.Collection.Post = Backbone.Collection.extend({
    model: function (m, options) {
        var returnModel;
        switch (m._type.toLowerCase()) {
            case 'textpost':
                returnModel = new friends.Model.TextPost(m, options);
                break;
            case 'eventpost':
                returnModel = new friends.Model.EventPost(m, options);
                break;
            default:
                returnModel = new friends.Model.Post(m, options);
                break;
        }
        return returnModel;
    },
    url:'/api/post/',
    parse:function(result) {
        return result;
    }
})