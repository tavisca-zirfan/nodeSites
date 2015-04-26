window.friends.Views.ProfilePic = Backbone.View.extend({
    template:'#profilePicViewTemplate',
    initialize:function(params) {
        if (!window.friends.hbTemplate.ProfilePic) window.friends.hbTemplate.ProfilePic = Handlebars.compile($(this.template).html());
        this.$container = params.$container;
        this.render();
    },
    render:function() {
        this.$container.html($(window.friends.hbTemplate.ProfilePic(this.model)));
        this.bindEvents();
    },
    bindEvents:function() {
        $('a', this.$container).on('click', function() {

        });
    },
    createPreview:function() {
        
    }
})