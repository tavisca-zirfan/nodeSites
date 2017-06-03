window.friends.Views.EventView = Backbone.View.extend({
	readTemplate:'#eventThumbnailViewTemplate',
	editTemplate:'#eventEditViewTemplate',
	initialize:function(options){
		if(!friends.hbTemplate.EventReadView) friends.hbTemplate.EventReadView = Handlebars.compile($(this.readTemplate).html());
		if(!friends.hbTemplate.EventEditView) friends.hbTemplate.EventEditView = Handlebars.compile($(this.editTemplate).html());
		if(!friends.hbTemplate.EventOtherEditView) friends.hbTemplate.EventOtherEditView = Handlebars.compile($('#eventReadViewTemplate').html());
		this.model = this.model||new friends.Model.EventPost();		
		window.friends.bag.profileList = window.friends.bag.profileList||new friends.Collection.Profile();
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
	_fillModel:function(callback){
		var that = this;
		var ids = (that.model.attributes.peopleInvited);
		var  idsToBeFetched = [];
		var peopleInvited =[];
		var peopleComing=[];
		_.each(ids,function(id){
			if(friends.bag.profileList.get(id)){
				
			}
			else
				idsToBeFetched.push(id);					
		});
		if(idsToBeFetched.length>0){
			friends.bag.profileList.fetch({listOfIds:idsToBeFetched,success:function(){
				_.each(that.model.attributes.peopleInvited,function(id){
					var model = friends.bag.profileList.get(id)
					peopleInvited.push(model);
				});
				_.each(that.model.attributes.peopleComing,function(id){
					var model = friends.bag.profileList.get(id)
					peopleComing.push(model);
				});
				that.model.attributes.peopleInvitedF = peopleInvited;
				that.model.attributes.peopleComingF = peopleComing;
				callback();
			}});
		}else
			callback();
	},
	renderOtherEdit:function(){
		var that = this;
		this._fillModel(function(){
			that.$modal = $(friends.hbTemplate.EventOtherEditView(that.model));
			//this.bindEditEvents();
			that.$modal.modal('show');
			that._renderMap();
		});
		
	},
	bindReadEvents:function(){
		var that = this;
		$('a',this.$el).on('click',function(){
			that.renderEdit();
		});
		$('.glyphicon-edit',this.$el).on('click',function(){
			that.renderOtherEdit();
		});
	},
	bindEditEvents:function(){
		var that = this;
		var lazySearch = _.debounce(function(query){
			if(that.model.isNew() || friends.bag.profile.id==that.model.attributes.from._id){
				var data= {name:query.term};
				//window.friends.bag.profileList = window.friends.bag.profileList||new friends.Collection.Profile();
				window.friends.bag.profileList.fetch({data:data,success:function(){
					var results = [];
					friends.bag.profileList.each(function(profile){
						results.push({id:profile.id,
							text:profile.attributes.name.firstName+' '+profile.attributes.name.lastName,
							img:profile.attributes.imageUrl});
					});
					query.callback({results:results});
				}});
			}
			else
				query.callback({results:[]});
		},1000) 
		
		if(!that.model.isNew()){
			$("#eventDate",this.$modal).val(moment(that.model.get('when')).format('Do MMM YYYY')).attr('disabled','disabled');
			$("#eventDescription",this.$modal).val(that.model.get('text')).attr('disabled','disabled');
			$("#eventName",this.$modal).val(that.model.get('name')).attr('disabled','disabled');

		}
		$("#eventDate",this.$modal).datepicker();
		$('#peopleInvited',this.$modal).val('5543e7d9db967f1811fd1e4b,554dd2e43333923c09b07068');
		$('#peopleInvited',this.$modal).select2({
			query:lazySearch,
			formatResult:function(item){
				return "<img style='height:50px;margin-right:10px;' class='img img-circle' src='"+item.img+"'/><span>"+item.text+"</span>"
			},
			//disabled:!(that.model.isNew() || friends.bag.profile.id==that.model.attributes.from._id),
			disabled:true,
			tags: true,
			initSelection:function(element,callback){
				var availableIds = [];
				var idsToBeFetched = [];
				var ids = (that.model.attributes.peopleInvited);
				_.each(ids,function(id){
					if(friends.bag.profileList.get(id)){
						var model = friends.bag.profileList.get(id)
						availableIds.push({id:id,text:model.attributes.name.firstName+' '+model.attributes.name.lastName});
					}
					else
						idsToBeFetched.push(id);					
				});
				if(idsToBeFetched.length>0){
					friends.bag.profileList.fetch({listOfIds:idsToBeFetched,success:function(){
						_.each(ids,function(id){
							var model = friends.bag.profileList.get(id)
							availableIds.push({id:id,text:model.attributes.name.firstName+' '+model.attributes.name.lastName});
						});
						results = availableIds;
						//results = [{id:'5543e7d9db967f1811fd1e4b',text:'Zaid'},{id:'554dd2e43333923c09b07068',text:'Aditya'}];
						callback(results);
					}});
				}
				results = availableIds;
				//results = [{id:'5543e7d9db967f1811fd1e4b',text:'Zaid'},{id:'554dd2e43333923c09b07068',text:'Aditya'}];
				callback(results);
			}
		});
		$("#btnEventSave",this.$modal).on('click',function(){
			that.model = that.model||new friends.Model.EventPost();
			that.model.set('name',$('#eventName',that.$modal).val());
			that.model.set('text',$('#eventDescription',that.$modal).val());
			var geopoint = $('#geolocation',that.$modal).val().split(',');
			that.model.set('where',{place:$('#txtMapSearch',that.$modal).val(),latitude:geopoint[0],longitude:geopoint[1]});
			that.model.set('when',new Date($('#eventDate',that.$modal).val()));
			that.model.set('peopleInvited',_.pluck($('#peopleInvited',that.$modal).select2('data'),'id'));
			var isNew = that.model.isNew();
			if(isNew){
				that.model.save(null,{success:function(m){
					that.trigger('created',that.model);
					that.$modal.modal('hide');
				}});
			}else{
				that.model.save(null,{success:function(m){
					that.$modal.modal('hide');
				}});
			}
		});
		
	},
	_renderMap:function(){
		var that = this;
		var isEditable = this.model.isNew();
		that.geoLocationView = new friends.Views.GeoLocationView({ 
				model: that.model.attributes.where==null?{adress:'',geolocation:''}:{
                    address: that.model.attributes.where.place,
                    geolocation: that.model.attributes.where.latitude+','+that.model.attributes.where.longitude
                },               
                options: {
                    isEditable:isEditable,
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