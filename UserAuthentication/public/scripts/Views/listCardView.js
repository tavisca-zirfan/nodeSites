window.friends.Views.ListCardView = friends.Views.BaseCardView.extend({
	childTemplate:'#profileListTemplate',
	_initializeChild:function(params){
		this.propertyName = params.propertyName;
		this.list = params.list;		
		if(!friends.hbTemplate.ListCardView) friends.hbTemplate.ListCardView = Handlebars.compile($(this.childTemplate).html());

	},
	_renderChildRead:function(){
		var that = this;
		var listing = [];
		this.list.forEach(function(attr,index){
			listing.push({title:attr.title,key:attr.propertyName,value:that.model[attr.propertyName]||attr.default});
		});
		$('.card-content',this.$el).html($(friends.hbTemplate.ListCardView({listing:listing})));
		$('.editable-property',this.$el).attr('contenteditable','false');
	},
	_renderChildEdit:function(){
		$('.editable-property',this.$el).attr('contenteditable','true');
	},
	_childSave:function(){
		var that = this;
		$('.editable-property',this.$el).each(function(){
			that.model[$(this).data('property')]=$(this).text();
		});
	},
});