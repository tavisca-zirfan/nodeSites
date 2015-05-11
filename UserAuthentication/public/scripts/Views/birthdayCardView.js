window.friends.Views.BirthdayCardView = friends.Views.BaseCardView.extend({
	childReadTemplate:'#profileDOBReadTemplate',
	childEditTemplate:'#profileDOBEditTemplate',
	_initializeChild:function(params){
		this.propertyName = params.propertyName;	
		this.options = params.options;	
		if(!friends.hbTemplate.BirthdayCardReadView) friends.hbTemplate.BirthdayCardReadView = Handlebars.compile($(this.childReadTemplate).html());
		if(!friends.hbTemplate.BirthdayCardEditView) friends.hbTemplate.BirthdayCardEditView = Handlebars.compile($(this.childEditTemplate).html());
	},
	_renderChildRead:function(){
		var content = '';
		if(!_.isEmpty(this.model.get(this.propertyName))){
			var dob = moment(this.model.get(this.propertyName)).format('Do MMMM YYYY');
			var nextBday = friends.utils.getUpcomingBirthday(this.model.get(this.propertyName));
			var daysToGo = nextBday.diff(moment(),'days')+ ' days to go';
			content = dob+'<br />('+daysToGo+')';
		}
		else
			content = "I don't want to tell my age";
		$('.card-content',this.$el).html($(friends.hbTemplate.BirthdayCardReadView({content:content})));		
	},
	_renderChildEdit:function(){
		$('.card-content',this.$el).html($(friends.hbTemplate.BirthdayCardEditView({months:moment.months(),year:moment().year()})));
		if(!_.isEmpty(this.model.get(this.propertyName))){
			var myDate = moment(this.model.get(this.propertyName));
			$('#date',this.$el).val(myDate.date());
			$('#month',this.$el).val(myDate.month());
			$('#year',this.$el).val(myDate.year());
		}
				
	},
	_childSave:function(){
		var that = this;
		var date = new Date($('#year',that.$el).val(),$('#month',that.$el).val(),$('#date',that.$el).val());
		this.model.set(this.propertyName,date.toUTCString('mm dd yyyy'));
	},
});