window.friends.Views.EventListView = Backbone.View.extend({
	el:'.event-list-notification',
	template:'#eventListViewTemplate',
	initialize:function(){
		if(!friends.hbTemplate.EventListView) friends.hbTemplate.EventListView = Handlebars.compile($(this.template).html());
		this.listenTo(this.collection,'add',this._renderEvent);
		data = {byUser:friends.bag.profile.id,when:new Date()}
		this.collection.fetch({data:data});
		this.render();
	},
	render:function(){
		this.$el.html(friends.hbTemplate.EventListView());
		this.$eventList = $('.event-list',this.$el);
		this.bindEvents();
		return this.$el;		
	},
	_renderEvent:function(event){
		this.$eventList.append((new friends.Views.EventView({model:event})).renderRead());
	},
	bindEvents:function(){
		var that = this;
		$("#btnPlanEvent",this.$el).on('click', function() {
			var eventView = new friends.Views.EventView();
			eventView.renderEdit();
			eventView.on('created',function(model){
				that.collection.add(model);
			});            
        });
	},
})