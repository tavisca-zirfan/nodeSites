window.friends.Views.EventView = Backbone.View.extend({
	readTemplate:'#eventThumbnailViewTemplate',
	editTemplate:'#eventEditViewTemplate',
	initialize:function(options){
		if(!friends.hbTemplate.EventReadView) friends.hbTemplate.EventReadView = Handlebars.compile($(this.readTemplate).html());
		if(!friends.hbTemplate.EventEditView) friends.hbTemplate.EventEditView = Handlebars.compile($(this.editTemplate).html());
		this.model = this.model||new friends.Model.EventPost();

	},
	renderRead:function(){
		this.$el = $(friends.hbTemplate.EventReadView(this.model));
		this.bindReadEvents();
		return this.$el;
	},
	renderEdit:function(){
		this.$modal = $(friends.hbTemplate.EventEditView(this.model));
		this.bindEditEvents();
		this.$modal.modal('show');
		this._renderMap();
	},
	bindReadEvents:function(){
		var that = this;
	},
	bindEditEvents:function(){
		var data = [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }, { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }, { id: 4, text: 'wontfix' }];
 
		var that = this;
		$("#eventDate",this.$modal).datepicker();
		$('#peopleInvited',this.$modal).select2({tags:true,
			// query:function(req){
			// 	console.log(req);
			// },
			data:[{id:1,text:'zaid'},{id:2,text:'avani'}]
			});
		$("#btnEventSave",this.$modal).on('click',function(){
			that.model = that.model||new friends.Model.EventPost();
			that.model.set('name',$('#eventName',that.$modal).val());
			that.model.set('text',$('#eventDescription',that.$modal).val());
			that.model.set('where',{place:$('#eventLocation',that.$modal).val()});
			that.model.set('when',new Date($('#eventDate',that.$modal).val()));
			var isNew = that.model.isNew();
			if(isNew){
				that.model.save(null,{success:function(m){
					that.trigger('created',that.model);
					that.$modal.modal('hide');
				}});
			}
		});
		
	},
	_renderMap:function(){
		var that = this;
		var isEditable = this.model.isNew();
		that.geoLocationView = new friends.Views.GeoLocationView({ 
				model: {
                    address: $('#eventLocation', that.$modal).val(),
                    geolocation: $('#geolocation', that.$modal).val()
                },               
                options: {
                    isEditable:false,
					$container:$('.geo-map',that.$modal),
					txtbox:$('#geolocation',that.$modal),
					onchange:function(pointstr,point){
						console.log(pointstr);
						console.log(point);
					}
                }
            });
            that.geoLocationView.render();
	}
});