window.friends.Views.BaseCardView = Backbone.View.extend({
	template:'#profileCardTemplate',
	childTemplate:'',
	initialize:function(params){
		this.$container = params.$container;		
		this.title = params.title;
		this.canEdit = params.canEdit;
		if(!friends.hbTemplate.BaseCardView) friends.hbTemplate.BaseCardView = Handlebars.compile($(this.template).html());
		this._initializeChild(params);
		this.render();
	},
	_initializeChild:function(params){},
	render:function(){
		this.$el.html($(friends.hbTemplate.BaseCardView({title:this.title,canEdit:this.canEdit})));
		this._renderRead();
		this.bindEvents();
	},
	_renderRead:function(){
		$('.card-edit',this.$el).hide();
		$('.card-read',this.$el).show();
		this._renderChildRead();
	},
	_renderChildRead:function(){},
	_renderChildEdit:function(){},
	_renderEdit:function(){
		$('.card-edit',this.$el).show();
		$('.card-read',this.$el).hide();
		// this.originalModel = this.model;
		// this.model = new friends.Model.Profile(this.model.toJSON());
		this._renderChildEdit();
	},
	bindEvents:function(){
		var that = this;
		$('.glyphicon-edit',that.$el).on('click',function(){
			that._renderEdit();
		});
		$(".glyphicon-ok",that.$el).on('click',function(){
			that.save();
			that._renderRead();
		});
		$('.glyphicon-refresh').on('click',function(){
			that.refresh();
			that._renderRead();
		});
		this._bindChildEvents();
	},
	_bindChildEvents:function(){},
	save:function(){
		this._childSave();
	},
	_childSave:function(){},
	refresh:function(){
		this._renderRead();
	}
})