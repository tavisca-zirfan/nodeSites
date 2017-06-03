window.friends.Views.ProfileView = Backbone.View.extend({
    template: '#profileViewTemplate',
    el:'#profile',
    initialize:function(params) {
        if (!window.friends.hbTemplate.ProfileView) window.friends.hbTemplate.ProfileView = Handlebars.compile($(this.template).html());
        this.render();
    },
    render: function () {
        this.$profileView = $(window.friends.hbTemplate.ProfileView());
        this.$el.html(this.$profileView);
        this._renderPic();
    },
    _renderPic:function() {
        this.profilePicView = new friends.Views.ProfilePic({ model: this.model, $container: $('.profile-pic', this.$el) });
    },
    _renderActivities:function() {
        
    },
    bindEvents:function() {
        
    }
})