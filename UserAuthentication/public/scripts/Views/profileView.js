window.friends.Views.ProfileView = Backbone.View.extend({
    template: '#profileViewTemplate',
    el:'#profile',
    initialize:function(params) {
        this.profileId = params.profileId;
        this.model = new friends.Model.Profile({_id:this.profileId});
        var canEdit = this.profileId == friends.bag.user._id;
        this.model.set('canEdit',canEdit);
        if (!window.friends.hbTemplate.ProfileView) window.friends.hbTemplate.ProfileView = Handlebars.compile($(this.template).html());
        this.listenTo(this.model,'sync',this.render);
        this.model.fetch();
    },
    render: function () {
        this.originalModel = new friends.Model.Profile(JSON.parse(JSON.stringify(this.model)));
        this.$profileView = $(window.friends.hbTemplate.ProfileView(this.model));
        this.$el.html(this.$profileView);
        this._renderPic();
        this._renderAbout();
        this._renderPerfectDate();
        this._renderPerfectFriend();
        this._renderEducation();
        this._renderRelationshipStatus();
        this._renderBirthday();
        this._renderFriends();
        this.bindEvents();
    },
    _renderPic:function() {
        this.profilePicView = new friends.Views.ProfilePic({ model: this.model, $container: $('.profile-pic', this.$el) });
    },
    _renderAbout:function(){        
        this.aboutCard = new friends.Views.InfoCardView({title:'About',propertyName:'about',model:this.model,el:'.about',canEdit:this.model.get('canEdit')});
    },
    _renderPerfectDate:function(){        
        this.aboutCard = new friends.Views.InfoCardView({title:'Idea of Perfect Date',propertyName:'perfectDate',model:this.model,el:'.perfect-date',canEdit:this.model.get('canEdit')});
    },
    _renderPerfectFriend:function(){        
        this.aboutCard = new friends.Views.InfoCardView({title:'Definition of Perfect Friend',propertyName:'perfectFriend',model:this.model,el:'.perfect-friend',canEdit:this.model.get('canEdit')});
    },
    _renderEducation:function(){
        var list = [{title:'Completed my schooling from ',propertyName:'school',default:'Nowhere, i cant read'},
        {title:'which is in the city of ',propertyName:'schoolLocation',default:'every city'},
        {title:'Completed my Graduation from ',propertyName:'college',default:'Schooling was required'},
        {title:'which is in the city of ',propertyName:'collegeLocation',default:"Can't be found"}]
        this.educationCard = new friends.Views.ListCardView({title:'Education Background',list:list,model:this.model.get('history')||{},el:'.education',canEdit:this.model.get('canEdit')});
    },
    _renderFriends:function(){
        this.friendsCard = new friends.Views.FriendListView();
    },
    _renderBirthday:function(){
        this.birthdayCard = new friends.Views.BirthdayCardView({title:'Birthday',propertyName:'dob',model:this.model,el:'.birthday',canEdit:this.model.get('canEdit')});
    },
    _renderRelationshipStatus:function(){
        var options = [{text:'single',value:'single'},{text:'committed',value:'committed'},
        {text:'not sure',value:'not sure'},{text:'committed but available',value:'committed but available'},
        {text:'none of your business',value:'none of your business'}];
        this.relationshipCard = new friends.Views.DropdownCardView({title:'Relationship Status',options:options,model:this.model,
            el:'.relationship',canEdit:this.model.get('canEdit'),propertyName:'relationship'});
    },
    _renderActivities:function() {
        
    },
    bindEvents:function() {
        var that = this;
        $('.btnSave',this.$el).on('click',function(){
            that.model.save();
            return false;
        });
        $('.add-friend',this.$el).on('click',function(){
            that.model.attributes.friendRequestSent.create({});
            $(this).text('Friend Request Sent').attr('disabled', 'disabled');
        });
        $('.confirm-friend',this.$el).on('click',function(){
            friends.bag.profile.attributes.friendRequestRecieved.remove(that.model.id);
            that.model.attributes.friends.create({});
            $(this).hide();
        });
        $('.btnCancel',this.$el).on('click',function(){
            that.model = that.originalModel;
            that.render();
            return false;
        });
    }
})