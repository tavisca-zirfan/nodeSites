window.friends.Model.Dislike = Backbone.Model.extend({
	idAttribute:'_id',
	parse:function(model){
		if(typeof model == "object"){
			return model;
		}else if(typeof model == "string"){
			return {_id:model};
		}else{
			return {model:model};
		}
	}
});

window.friends.Collection.Dislikes = Backbone.Collection.extend({
	model:friends.Model.Dislike,	
	url:function(){
		var baseUrl = this.parent.url()+'/'
		return baseUrl+'dislike/';
	}
});
