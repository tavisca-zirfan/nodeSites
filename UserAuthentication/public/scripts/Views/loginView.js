window.friends.Views.LoginView = Backbone.View.extend({
	template:'#tmplLoginView',
	el:'#loginContainer',
	initialize:function(options){
		if(!friends.hbTemplate.LoginView) friends.hbTemplate.LoginView = Handlebars.compile($(this.template).html());
		this.render();
	},
	render:function(){
		this.$el.html($(friends.hbTemplate.LoginView({message:'cool'})));
		this._bindEvents();
	},
	_bindEvents:function(){

	}
})