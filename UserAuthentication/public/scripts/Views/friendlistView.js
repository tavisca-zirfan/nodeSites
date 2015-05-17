window.friends.Views.FriendListView = Backbone.View.extend({
    template: '#profileFriendListTemplate',
    el:".friendlist",
    initialize:function(params) {
        var that = this;
        params = params||{};
        this.profile = params.profile|| friends.bag.profile;
        if (!friends.hbTemplate.FriendListView) friends.hbTemplate.FriendListView = Handlebars.compile($(this.template).html());
        this.$el.html(Handlebars.compile($('#profileFriendSectionTemplate').html())());
        this.collection = new friends.Collection.Profile();
        if(this.profile.id==friends.bag.user._id)
            this.chatListView = new friends.Views.ChatListView({socket:friends.bag.socket});
        this.listenTo(this.collection, 'sync', this.render);
        this.collection.fetch({reset:true});
        if(this.profile.id==friends.bag.user._id){
            setInterval(function() {
                that._search(true);
            },300000);
        }
    },

    render: function (profiles) {
        var that = this;    
        $('.panel-body',that.$el).html($(friends.hbTemplate.FriendListView({profiles:profiles.models}))); 
        that.bindEvents();       
    },

    bindEvents:function(){
        var that = this;
        $('#friendSearch').keyup(function(e) {
            clearTimeout($.data(this, 'timer'));
            if (e.keyCode == 13)
                that._search(true);
            else{
                $(this).data('timer', setTimeout(function(){
                    that._search(true);
                },500));
            }
        });
        if(this.chatListView){
            $('.friend-thumbnail',this.$el).on('click',function(){
                var profile = that.collection.get($(this).data('id'));
                if(!profile){
                    profile = new friends.Model.Profile({_id:$(this).data('id')});
                    profile.fetch();
                }
                that.chatListView.createPopup(profile);
            });
        }
    },
    _search:function(force) { 
        var value =  $('#friendSearch').val();      
        if (!force && value.length < 3) return; //wasn't enter, not > 2 char
        var data = {};
        data['name'] = value;
        //data['list'] = this.profile.get('friends');
        if(this.profile.id==friends.bag.user._id) data['sortBy'] = 'accountInfo.lastSeen';
        this.collection.fetch({reset:true,data:data});
    }
});