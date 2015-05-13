window.friends.Views.PostListView = Backbone.View.extend({
    el: '.post-list',
    template: '#postListTemplate',
    initialize: function () {
        var that = this;
        if (!friends.hbTemplate.PostListView) friends.hbTemplate.PostListView = Handlebars.compile($(this.template).html());
        this.lastUpdate = null;
        this.render();
        this.bindEvents();
        this.collection = new friends.Collection.Post();
        this.listenTo(this.collection, 'sync', this.renderPostList);
        this.listenTo(this.collection, 'add', this._addPost);
        this.collection.fetch();
        // that.fetchTime = new Date().toUTCString();
        // setInterval(function () {
        //     var filters = [];
        //     if (that.lastUpdate) {
        //         filters.push(new Filter('lastupdate', that.lastUpdate));
        //     }
        //     var searchFilter = friends.utils.Filter.createFilter(filters);
        //     that.postList.reset();
        //     that.fetchTime = new Date().toUTCString();
        //     that.postList.fetch({ data: searchFilter });
        // },10000);
    },
    render:function() {
        this.$el.html($(friends.hbTemplate.PostListView()));
        this.$postListContainer = $('.posts',this.$el);
    },
    renderPostList:function(posts) {
        var that = this;
        //_.forEach(posts.models, function (post) {
            
        //});
        that.lastUpdate = that.fetchTime;
    },
    _addPost: function (post) {
        var that = this;
        var insertPost = true;
        var $card = $('#' + post.id, that.$postListContainer);
        if ($card) {
            insertPost = !$('.comment-box', $card).is(':focus');
            if (insertPost) {
                $card.remove();
            }
        }
        if (insertPost)
            post.renderView(this.$postListContainer);
    },
    bindEvents: function () {
        var that = this;
        $('.post-message', this.$el).on('keydown', function(e) {
            if (e.keyCode == 13) {
                var text = $(this).val();
                var model = new friends.Model.TextPost({text:text,to:friends.bag.user._id});
                model.save();
                model.on('sync', function(m) {
                    that.collection.add(m);
                    $('.post-message', that.$el).val('');
                }); 
                
            }
        });
    }
});