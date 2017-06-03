window.friends.Views.BasePostView = Backbone.View.extend({
    initialize: function(param) {
        this.options = $.extend({}, this.options, this.childOptions);
        if (!window.friends.hbTemplate.BasePostView) window.friends.hbTemplate.BasePostView = Handlebars.compile($(this.options.baseTemplate).html());
        if (!window.friends.hbTemplate.ChildPostView) window.friends.hbTemplate.ChildPostView = Handlebars.compile($(this.options.childTemplate).html());
        //this.postType = this.model.get('postType');
        this.listenTo(this.model, 'sync', this.render);
        this.$container = param.$container;
        this.render();
    },
    options: {
        baseTemplate: '#basePostViewTemplate',

    },
    render: function() {
        var that = this;
        this.$card = $(window.friends.hbTemplate.BasePostView(this.model));
        $('.post-type-container', this.$card).html($(window.friends.hbTemplate.ChildPostView(this.model)));
        this._renderCommentList();
        this._renderLike();
        this._bindEvents();
        this.$container.prepend(this.$card);
    },
    _renderCommentList:function(){
        this.commentListView = new friends.Views.CommentListView({collection:this.model.get('comments'),$container: $('.commentsSection', this.$card)});
    },
    update: function () {
        var that = this;
        this.$card.html($(window.friends.hbTemplate.BasePostView(this.model)));
        $('.post-type-container', this.$card).html($(window.friends.hbTemplate.ChildPostView(this.model)));
        this._renderCommentList();
        this._bindEvents();
    },    
    _renderLike: function() {
        var that = this;
        var likeView = new friends.Views.LikeView({
            model: that.model,
            $el: $('.post-like', that.$card)
        });
    },
    _renderChild: function() {

    },
    _bindEvents: function () {
        var that = this;
        
    },
    _bindChildEvents: function() {},

    _initializeChild: function() {},

});

window.friends.Views.TextPostView = window.friends.Views.BasePostView.extend({
    childOptions: {
        childTemplate: '#textPostViewTemplate'
    }
});