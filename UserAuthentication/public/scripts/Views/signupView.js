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
		var that = this;
		$('#btnSignup',this.$el).on('click',function(){
			var user = new friends.Model.User({
				email:$('#email',that.$el).val(),
				password:$('#password',that.$el).val(),
				profile:{
					name:{
						firstName:$('#firstName',that.$el).val(),
						lastName:$('#lastName',that.$el).val(),
					},
					dob:new Date($('#year',that.$el).val(),$('#month',that.$el).val(),$('#date',that.$el).val()),
					gender:$('.gender:checked',that.$el).val()
				}
			});
			
			user.save({},{error:function(){
				return false;
			},success:function(){
				window.location.replace(friends.config.host+'/home');
			}});
		});
	}
})