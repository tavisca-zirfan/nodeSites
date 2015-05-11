window.friends.Views.DropdownCardView = friends.Views.BaseCardView.extend({
	childReadTemplate:'#profileDropdownReadTemplate',
	childEditTemplate:'#profileDropdownEditTemplate',
	_initializeChild:function(params){
		this.propertyName = params.propertyName;	
		this.options = params.options;	
		if(!friends.hbTemplate.DropdownCardReadView) friends.hbTemplate.DropdownCardReadView = Handlebars.compile($(this.childReadTemplate).html());
		if(!friends.hbTemplate.DropdownCardEditView) friends.hbTemplate.DropdownCardEditView = Handlebars.compile($(this.childEditTemplate).html());
	},
	_renderChildRead:function(){
		$('.card-content',this.$el).html($(friends.hbTemplate.DropdownCardReadView({content:this.model.get(this.propertyName)})));		
	},
	_renderChildEdit:function(){
		$('.card-content',this.$el).html($(friends.hbTemplate.DropdownCardEditView({options:this.options})));
		$('select',this.$el).val(this.model.get(this.propertyName));		
	},
	_childSave:function(){
		this.model.set(this.propertyName,$('select',this.$el).val());
	},
});