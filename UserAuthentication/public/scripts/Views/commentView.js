window.friends.Views.CommentView = Backbone.View.extend({
    initialize: function(param) {
        this.options= $.extend({}, this.options,param);
        if (!window.friends.hbTemplate.CommentView) window.friends.hbTemplate.CommentView = Handlebars.compile($(this.template).html());
        this.$container = param.$container;
        //this.listenTo(this.model, 'sync', this.update);
        this.render();
    },
    template: '#commentViewTemplate',
    options: {

    },
    render: function () {
        this.$comment = $(window.friends.hbTemplate.CommentView(this.model));
        this.$container.append(this.$comment);
        var likeView = new friends.Views.LikeView({
            model: this.model,
            $el: $('.comment-like', this.$comment)
        });
    },

    update:function() {
        this.$comment.html($(window.friends.hbTemplate.CommentView(this.model)));
    },
    
    _bindEvents: function() {

    },
    
});