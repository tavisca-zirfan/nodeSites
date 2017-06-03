window.friends.Views.ProfileSearchAutocomplete = Backbone.View.extend({
	initialize:function(options){
		this.Collection = new friends.Collection.Profile();
		this.bindAutoComplete();
	},
	bindAutoComplete: function () {
		var that = this;
        $('#txtSearch').autocomplete({
            minLength: 2,
            source: function (query, process) {
                that.Collection.fetch({
                    data:{name: query.term}, reset: true, success: function (data) {
                        if (data.models.length > 0) {
                            var profiles = [];
                            $.each(data.models, function () {
                                profiles.push({name:this.attributes.name.firstName+' '+this.attributes.name.lastName,img:this.attributes.imageUrl,id:this.id});
                            });
                            process(profiles);
                        }
                    }
                });
            }
            
        }).autocomplete( "instance" )._renderItem = function( ul, item ) {
      	return $( "<li>" )
        .append( "<a href='/profile/"+item.id+"'><img style='height:50px;width:40px;margin-right:10px;' class='img img-circle' src='"+item.img+"'/><span>"+item.name+"</span></a>" )
        .appendTo( ul );
    };;
    },
})