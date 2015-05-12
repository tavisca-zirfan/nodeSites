window.friends.Model.Dislike = Backbone.Model.extend({
	initialize:function(params){
		this.postId = params.postId;
		this.commentId = params.commentId;
	},
	urlRoot:function(){
		var baseUrl = '/api/post/'+this.postId+'/';
		if(!_.isEmpty(this.commentId)){
			baseUrl+='comment/'+this.commentId+'/';
		}
		baseUrl+='dislike/';
		return baseUrl;
	}
});

window.friends.Collection.Dislikes = Backbone.Collection.extend({
	model:friends.Model.Dislike,
	initialize:function(params){
		this.postId = params.postId;
		this.commentId = params.commentId;
	},
	url:function(){
		var baseUrl = '/api/post/'+this.postId+'/';
		if(!_.isEmpty(this.commentId)){
			baseUrl+='comment/'+this.commentId+'/';
		}
		baseUrl+='dislike/';
		return baseUrl;
	}
});
