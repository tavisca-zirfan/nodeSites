window.friends.Model.EventPerson = Backbone.Model.extend({
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

window.friends.Collection.EventPerson = Backbone.Collection.extend({
	model:friends.Model.Like,	
	url:function(){		
		return '/api/eventpost/'+this.parent.id+'/person/';
	}
});
