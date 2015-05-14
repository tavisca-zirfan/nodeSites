window.friends.Views.CommentListView = Backbone.View.extend({
    initialize: function(param) {
        this.options= $.extend({}, this.options,param);
        //this.postType = this.model.get('postType');
        //this.listenTo(this.collection, 'sync', this.render);
        this.listenTo(this.collection,'add',this._renderComment)
        this.$container = param.$container;
        this.render();
    },
    options: {
        
    },
    render: function() {
        var that = this;        
        _.forEach(this.collection.models, function(comment) {
            that._renderComment(comment);
        }); 
        that.bindEvents();       
    },
    _renderComment:function(comment){
        var commentView =new friends.Views.CommentView({model:comment,$container:$('.comments',this.$container)});
    },
    bindEvents:function(){
        var that = this;
        $('.comment-box', this.$container).on('keydown', function (e) {
            if (e.keyCode == 13) {
                that.collection.create({commentText:$(this).val()},{wait:true})
                $(this).val('');
            }
        });
    }
});