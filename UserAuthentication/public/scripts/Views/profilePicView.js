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
        var that = this;
        $('#frmPic').submit(function() {
                $(this).ajaxSubmit({
                    error: function(xhr) {
                            status('Error: ' + xhr.status);
                    },
                    success: function(response) {
                        that.model.imageUrl = response.path;
                        that.render();
                    }
                });
                //Very important line, it disable the page refresh.
                return false;
            });
        $('#picSave', this.$container).on('click', function() {
            $('#frmPic').submit();
        });
    },
    createPreview:function() {
        
    }
})