window.friends.Model.Like = Backbone.Model.extend({
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

window.friends.Collection.Likes = Backbone.Collection.extend({
	model:friends.Model.Like,	
	url:function(){
		var baseUrl = this.parent.url()+'/'
		return baseUrl+'like/';
	}
});