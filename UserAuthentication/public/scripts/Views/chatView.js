window.friends.Views.ChatView = Backbone.View.extend({
	
	template:'#chatViewTemplate',
	widthPercent:23,
	initialize:function(params){
		this.profile = params.profile;
		this.userid = this.profile.id;
		
		this.$container = params.$container;
		//this.userProfile = new friends.Model.Profile({_id:params.userid});
		this.collection = new friends.Collection.Message();
		this.listenTo(this.collection,'add',this._renderMessage);
		//this.userProfile.fetch();
		if(!friends.hbTemplate.ChatView) friends.hbTemplate.ChatView = Handlebars.compile($(this.template).html());
		this.render();
	},
	position:function(index){
		var right = index * this.widthPercent;
		this.$el.css('right',right+'%');
	},
	render :function(){
		this.$el = $(friends.hbTemplate.ChatView({id:this.userid}));
		this.$chatBody = $('ul.chat',this.$el);
		this.$container.append(this.$el);
		this.bindEvents();
	},
	_reRenderChat:function(){
		var that = this;
		_.each(this.collection.models,function(model){
			that._renderMessage(model);
		});
	},
	_renderMessage:function(message){
		var $message = $('li[clientid="'+message.get('clientid')+'"]');
		if(message.get('from')==friends.bag.user._id ||(typeof message.attributes.from=="object" && message.attributes.from.id==friends.bag.user._id)){
			message.attributes.from = friends.bag.profile;
			message.attributes.to = this.profile;			
		}else{
			message.attributes.to = friends.bag.profile;
			message.attributes.from = this.profile;
		}
		if($message && $message.length>0){
			var messageView = new friends.Views.MessageView({model:message,$el:$message});
			messageView.render(message);
		}
		else{
			var messageView = new friends.Views.MessageView({model:message});
			this.$chatBody.append(messageView.render());
		}
	},
	bindEvents:function(){
		var that = this;
		var sendMessage = function(){
			var msgText = $('#btn-input').val().trim();
			if(msgText!=""){
				var message =new friends.Model.Message({text:msgText,to:that.profile.id,from:friends.bag.user._id
					,createdAt:new Date()});
				message.set('clientid',message.cid);
				that.trigger('createMessage',message);
				that._renderMessage(message);
				$('#btn-input').val('');
				
			}
		}
		$('#btn-input',this.$el).on('keyup',function(e){
			if(e.keyCode==13)
				sendMessage();
		});
		$('#btn-chat',this.$el).on('click',function(){
			sendMessage();
		});
		setInterval(function(){
			that._reRenderChat();
		},30000);
	}
});

window.friends.Views.MessageView = Backbone.View.extend({
	template:'#chatMessageViewTemplate',
	initialize:function(params){
		this.$el = params.$el;
		if(!friends.hbTemplate.ChatMessageView) friends.hbTemplate.ChatMessageView = Handlebars.compile($(this.template).html());
		//this.listenTo(this.model,'change',this.render);
	},
	render:function(){
		//var message = message||this.model;
		if(this.$el){
			var $newel = $(friends.hbTemplate.ChatMessageView(this.model.attributes));
			this.$el.html($($newel.html()));
		}else{
			this.$el = $(friends.hbTemplate.ChatMessageView(this.model.attributes));
			return this.$el;
		}
	}
});