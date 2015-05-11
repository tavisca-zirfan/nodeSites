window.friends.Views.InfoCardView = friends.Views.BaseCardView.extend({
	childTemplate:'#profileInfoTemplate',
	_initializeChild:function(params){
		this.propertyName = params.propertyName;		
		if(!friends.hbTemplate.InfoCardView) friends.hbTemplate.InfoCardView = Handlebars.compile($(this.childTemplate).html());

	},
	_renderChildRead:function(){
		$('.card-content',this.$el).html($(friends.hbTemplate.InfoCardView({content:this.model.get(this.propertyName)})));
		$('.info-content',this.$el).attr('contenteditable','false');
	},
	_renderChildEdit:function(){
		$('.info-content',this.$el).attr('contenteditable','true');
	},
	_childSave:function(){
		this.model.set(this.propertyName,$('.info-content',this.$el).html());
	},
});