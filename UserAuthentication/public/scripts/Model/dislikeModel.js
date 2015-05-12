window.friends.Model.Dislike = Backbone.Model.extend({
	
});

window.friends.Collection.Dislikes = Backbone.Collection.extend({
	model:friends.Model.Dislike,	
	url:function(){
		var baseUrl = this.parent.url()+this.parent.id+'/'
		return baseUrl+'dislike/';
	}
});
