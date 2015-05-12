window.friends.Model.Like = Backbone.Model.extend({
	initialize:function(params){
		this.postId = params.postId;
		this.commentId = params.commentId;
	},
	urlRoot:function(){
		var baseUrl = '/api/post/'+this.postId+'/';
		if(!_.isEmpty(this.commentId)){
			baseUrl+='comment/'+this.commentId+'/';
		}
		baseUrl+='like/';
		return baseUrl;
	}
});

window.friends.Collection.Likes = Backbone.Collection.extend({
	model:friends.Model.Like,
	initialize:function(params){
		this.postId = params.postId;
		this.commentId = params.commentId;
	},
	url:function(){
		var baseUrl = '/api/post/'+this.postId+'/';
		if(!_.isEmpty(this.commentId)){
			baseUrl+='comment/'+this.commentId+'/';
		}
		baseUrl+='like/';
		return baseUrl;
	}
});