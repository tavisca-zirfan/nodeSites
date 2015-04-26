window.friends.Views.LikeView = Backbone.View.extend({
    template: '#likeViewTemplate',
    initialize:function(params) {
        if (!window.friends.hbTemplate.LikeView) friends.hbTemplate.LikeView = Handlebars.compile($(this.template).html());
        this.listenTo(this.model, 'disliked', this.render);
        this.listenTo(this.model, 'liked', this.render);
        this.$el = params.$el;
        this.render(this.model);
    },
    render:function(model) {
        var that = this;
        this.$el.html($(friends.hbTemplate.LikeView(model)));
        this.bindEvents();
    },
    bindEvents: function () {
        var that = this;
        $('.glyphicon-thumbs-up', this.$el).on('click', function() {
            that.model.like();
        });
        $('.glyphicon-thumbs-down', this.$el).on('click', function () {
            that.model.dislike();
        });
    }
});