window.friends.Views.LikeView = Backbone.View.extend({
    template: '#likeViewTemplate',
    initialize:function(params) {
        if (!window.friends.hbTemplate.LikeView) friends.hbTemplate.LikeView = Handlebars.compile($(this.template).html());
        this.listenTo(this.model.attributes.likes, 'add', this.render);
        this.listenTo(this.model.attributes.dislikes, 'add', this.render);
        this.listenTo(this.model.attributes.likes, 'remove', this.render);
        this.listenTo(this.model.attributes.dislikes, 'remove', this.render);
        this.$el = params.$el;
        this.render();
    },
    render:function() {
        var that = this;
        this.$el.html($(friends.hbTemplate.LikeView(this.model.attributes)));
        this.bindEvents();
    },
    bindEvents: function () {
        var that = this;
        $('.glyphicon-thumbs-up', this.$el).on('click', function() {
            var currentLike = that.model.attributes.likes.get(friends.bag.user._id);
            if(currentLike && currentLike.id){
                currentLike.destroy();
            }else{
                that.model.attributes.likes.create({});
            }
            
        });
        $('.glyphicon-thumbs-down', this.$el).on('click', function () {
            var currentDislike = that.model.attributes.dislikes.get(friends.bag.user._id);
            if(currentDislike && currentDislike.id){
                currentDislike.destroy();
            }else{
                that.model.attributes.dislikes.create({});
            }
        });
    }
});