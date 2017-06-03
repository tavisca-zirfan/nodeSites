window.friends.Model.PostLike = Backbone.Model.extend({
    defaults: {
        postType: 'PostText'
    },
    like: function () {
        var that = this;
        $.ajax({
            url: '/webapi/post/like',
            data: that.toJSON(),
            type: 'Post',
            success: function (response) {
                console.log(response);
                var model = new friends.Model.PostLike(response);
                that.trigger('liked', model);
            }
        });
    },
    dislike:function() {
        var that = this;
        $.ajax({
            url: '/webapi/post/dislike',
            data: that.toJSON(),
            type: 'Post',
            success: function (response) {
                console.log(response);
                var model = new friends.Model.PostLike(response);
                that.trigger('disliked', model);
            }
        });
    }
});