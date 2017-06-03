window.friends.Views.ChatListView = Backbone.View.extend({
	initialize:function(params){
		var that = this;
		this.$container = $('#content');
		this.socket = params.socket;
		this.socket.on('message-client',function(message){
			that.receiveMessage(message);
		});
		this.listOfViews = [];
	},
	createPopup:function(profile){
		var that = this;
		var existingView = _.findWhere(this.listOfViews,{userid:profile.id});
		if(!existingView){
			var view = new friends.Views.ChatView({profile:profile,$container:this.$container,socket:this.socket});
			this.listenTo(view,'remove',this._removePopup);
			this.listenTo(view,'createMessage',function(message){
				that.socket.emit('message-server',message);
			});
			this.listOfViews.splice(0,0,view);
			this._repositionPopups();
			return view;
		}else{
			this._activatePopup(existingView);
			return existingView;
		}
		//this.listOfViews.push()
	},
	_removePopup:function(view){
		this.listOfViews = _.without(this.listOfViews,view);
		this._repositionPopups();
	},
	receiveMessage:function(serverMsg){	
		var that = this;
		var message = new friends.Model.Message(serverMsg);	
		var userid = message.get('from')==friends.bag.user._id?message.get('to'):message.get('from');
		var view = _.findWhere(this.listOfViews,{userid:userid});
		if(view){
			this._activatePopup(view);
			view.collection.add(message,{merge:true});
		}
		else{
			var profile = new friends.Model.Profile({_id:userid});
			profile.fetch({success:function(){
				view = that.createPopup(profile);
				view.collection.add(message,{merge:true});
			}});
			
		}		
		
	},
	_activatePopup:function(view){				
		if(view.rightPosition>100){
			this.listOfViews = _.without(this.listOfViews,view);
			this.listOfViews.splice(0,0,view);
			this._repositionPopups();
		}		
	},
	_repositionPopups:function(){
		_.each(this.listOfViews,function(curView,index){
			curView.position(index);
		});
	}
})