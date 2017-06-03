window.friends.Views.SignupView = Backbone.View.extend({
	template:'#tmplSignupView',
	el:'#signupContainer',
	initialize:function(options){
		if(!friends.hbTemplate.SignupView) friends.hbTemplate.SignupView = Handlebars.compile($(this.template).html());
		this.render();
	},
	render:function(){
		this.$el.html($(friends.hbTemplate.SignupView({months:moment.months(),year:moment().year()})));
		this._bindEvents();
	},
	_bindEvents:function(){

	}
})