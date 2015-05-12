window.friends.Model.Like = Backbone.Model.extend({
	
});

window.friends.Collection.Likes = Backbone.Collection.extend({
	model:friends.Model.Like,	
	url:function(){
		var baseUrl = this.parent.url()+this.parent.id+'/'
		return baseUrl+'like/';
	}
});