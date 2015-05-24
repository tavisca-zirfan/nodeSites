/**
Depends on	Backbone
jQuery
Jquery.UI
Google maps 
Gmap3 API
- Handlebars Template
**/

window.friends.Views.GeoLocationView = Backbone.View.extend({

    template: '#geographyViewTemplate',

    clckTimeOut: null,

    zoomLevel: 14,

    initialize: function (params) {
        this.options = params.options;
    },

    setInfowindow: function (results) {
        var infoText = results && results[0] ? results && results[0].formatted_address : 'no address';
        this.selected = results[0];
        var address_components = results[0].address_components;
        var components = {};
        jQuery.each(address_components, function (k, v1) { jQuery.each(v1.types, function (k2, v2) { components[v2] = v1.long_name }); })
        this.selected.address = components;
        this.$txtMapSearch.val(results[0].formatted_address);
        this.$txtGeolocation.val(results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng());
        infoText = infoText + '<div class="clear mts">Latitude : ' + results[0].geometry.location.lat() + '</div>';
        infoText = infoText + '<div class="clear mts">Longitude : ' + results[0].geometry.location.lng() + '</div>';

        if (this.options.onChange) this.options.onChange(results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng(), this.getValue());

        return infoText;
    },

    render: function () {
        this.isEditable = this.options.isEditable;

        var that = this;

        that.$el = $(Handlebars.compile($(that.template).html())(that.options));

        if (this.options.$container) {
            this.options.$container.append(that.$el);
        } else {
            that.$el.shroom({
                title: 'Select <span class="text-capitalize"> Select location on the Map </span>',
                modalSize: 'large',
                context: that,
                buttons: [{
                    isCancel: true,
                    text: 'Close',
                    onClose: that.close
                }, {
                    isOk: true,
                    text: 'Select',
                    onClick: that._handleSelectClick,
                    id: 'btnSelect'
                }]
            });
        }

        that.$mapEl = that.$el;

        that.$txtHdnGeography = $(this.options.txtbox);
        that.$txtGeolocation = $(this.options.geolocation);

        that.$divMap = $('#divMap', that.$mapEl);
        that.$divMap.height($(window).height() - 460);
        that.$txtMapSearch = $('#txtMapSearch', that.$mapEl);

        setTimeout(function () {
            that.initMap();
        }, 500);

        return this;
    },

    close: function () {
        this.destroy();
        Avgrund.deactivate();
    },

    destroy: function () {
        try {
            if (this.map) {
                this.$divMap.gmap3({ action: 'destroy' });
                this.$mapEl.remove();
                this.$txtMapSearch.autocomplete('destroy');
            }
        } catch (e) { }
    },

    getValue: function () {
        return {
            pt: {
                lat: this.selected.geometry.location.lat(),
                lng: this.selected.geometry.location.lng()
            },
            fa: this.selected.formatted_address,
            address: {
                street: this.selected.address.sublocality,
                city: this.selected.address.administrative_area_level_2,
                zip: this.selected.address.postal_code,
                cn: this.selected.address.country,
                st: this.selected.address.administrative_area_level_1
            }
        }
    },

    getAddressFromText: function () {
        var that = this;;
        this.$divMap.gmap3({
            action: 'getAddress',
            address: that.$txtMapSearch.val(),
            callback: function (results) {
                if (!results || results.length == 0) return;
                var infoText = that.setInfowindow(results);

                $(this).gmap3(
                { action: 'clear', name: 'marker' },
                {
                    action: 'addMarker', latLng: results[0].geometry.location,
                    map: {
                        zoom: that.zoomLevel,
                        center: true
                    },
                    marker: {
                        options: { draggable: true },
                        events: {
                            dragend: function (marker) {
                                $(this).gmap3({
                                    action: 'getAddress',
                                    latLng: marker.getPosition(),
                                    callback: function (results) {

                                        if (!results || results.length == 0) return;

                                        var map = $(this).gmap3('get');
                                        that.$txtHdnGeography.val(marker.position.lat() + ',' + marker.position.lng());
                                        infowindow = $(this).gmap3({ action: 'get', name: 'infowindow' });

                                        var content = that.setInfowindow(results);

                                        if (infowindow) {
                                            infowindow.open(map, marker);
                                            infowindow.setContent(content);
                                        } else {
                                            $(this).gmap3({ action: 'addinfowindow', anchor: marker, options: { content: content } });
                                        }
                                    }
                                });
                            },
                            click: function (marker, event, data) {
                                var map = $(this).gmap3('get'),
                                infowindow = $(this).gmap3({ action: 'get', name: 'infowindow' });
                                if (infowindow) {
                                    infowindow.open(map, marker);
                                }
                            }
                        }
                    },
                    infowindow: {
                        options: {
                            content: infoText
                        }
                    }
                });
                that.$txtHdnGeography.val(results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng());
            }
        });
    },

    getAddressFromLatLng: function (coord, doNotCenter) {
        var that = this;
        this.$divMap.gmap3(
        {
            action: 'getAddress',
            latLng: coord,
            callback: function (results) {
                if (!results || results.length == 0) return;
                var infoText = that.setInfowindow(results);
                if (!that.isEditable) {
                    that.$divMap.gmap3(
                        { action: 'clear', name: 'marker' },
                        {
                            action: 'addMarker',
                            latLng: coord,
                            map: {
                                zoom: that.map.zoom,
                                center: true
                            },
                            infowindow: {
                                options: {
                                    content: infoText
                                }
                            },
                            marker: {
                                events: {
                                    click: function (marker, event, data) {
                                        var map = $(this).gmap3('get'),
                                            infowindow = $(this).gmap3({ action: 'get', name: 'infowindow' });
                                        if (infowindow) {
                                            infowindow.open(map, marker);
                                        }
                                    }
                                }
                            }
                        });
                } else {
                    var position = {};
                    if (doNotCenter)
                        position = { zoom: that.map.zoom };
                    else
                        position = { zoom: that.map.zoom, center: true };

                    that.$divMap.gmap3(
                        { action: 'clear', name: 'marker' },
                        {
                            action: 'addMarker',
                            latLng: coord,
                            map: position,
                            marker: {
                                options: {
                                    draggable: true
                                },
                                events: {
                                    dragend: function (marker) {
                                        $(this).gmap3({
                                            action: 'getAddress',
                                            latLng: marker.getPosition(),
                                            callback: function (results) {
                                                if (!results || results.length == 0) return;
                                                var map = $(this).gmap3('get'), infowindow = $(this).gmap3({ action: 'get', name: 'infowindow' });
                                                var content = that.setInfowindow(results);
                                                if (infowindow) {
                                                    infowindow.open(map, marker);
                                                    infowindow.setContent(content);
                                                } else {
                                                    $(this).gmap3({ action: 'addinfowindow', anchor: marker, options: { content: content }, maxWidth: 450 });
                                                }
                                                that.$txtHdnGeography.val(marker.position.lat() + ',' + marker.position.lng());
                                            }
                                        });
                                    },
                                    click: function (marker, event, data) {
                                        var map = $(this).gmap3('get'),
                                            infowindow = $(this).gmap3({ action: 'get', name: 'infowindow' });
                                        if (infowindow) infowindow.open(map, marker);
                                    }
                                }
                            },
                            infowindow: {
                                options: {
                                    content: infoText
                                }
                            }
                        });
                }
            }
        });
    },

    initMap: function () {

        var that = this;
        this.$txtMapSearch.val(this.model.address);

        this.$mapEl.show();

        $("body").bind("keyup.myDialog", function (event) {
            // 27 == "esc"
            if (event.which == 27) {
                that.close();
                // unbind the event
                $("body").unbind("keyup.myDialog");
            }
        });

        if (!this.map) {
            this.$divMap.gmap3();

            this.map = this.$divMap.gmap3("get");

            if (this.isEditable) {
                // Only single click listener
                google.maps.event.addListener(this.map, 'click', function (event) { that.mapClick(event); });

                google.maps.event.addListener(this.map, 'zoom_changed', function () {
                    that.clckTimeOut = null;
                });
            }
        }

        if (this.model.address && this.model.address != '') {
            this.getAddressFromText();
            this.map.setZoom(this.zoomLevel);
        } else if (this.model.geolocation && this.model.geolocation !== '') {
            var temp = this.model.geolocation.split(',');
            var latitude = temp[0].trim();
            var longitude = temp[1].trim();
            var coord = new google.maps.LatLng(latitude, longitude);
            this.getAddressFromLatLng(coord);
            this.map.setZoom(this.zoomLevel);
        } else {
            this.$divMap.gmap3({ action: 'clear', name: 'marker' });
        }

        if (this.isEditable) {

            this.$txtMapSearch[0].onkeypress = function (e) {
                if (e.which == 13) {
                    that.getAddressFromText();
                    return false;
                }
            };


            this.$txtMapSearch.autocomplete({
                source: function (request, response) {
                    that.$divMap.gmap3({
                        action: 'getAddress',
                        address: that.$txtMapSearch.val(),
                        callback: function (results) {
                            if (!results) return;
                            var output = [];
                            results.forEach(function (item) {
                                output.push({ label: item.formatted_address, value: item.formatted_address, geometry: item.geometry });
                            });
                            response(output);
                        }
                    });
                },
                select: function (event, ui) {
                    var coord = new google.maps.LatLng(ui.item.geometry.location.lat(), ui.item.geometry.location.lng());
                    that.$txtHdnGeography.val(ui.item.geometry.location.lat() + ',' + ui.item.geometry.location.lng());
                    that.map.setZoom(14);
                    that.zoomLevel = 14;
                    that.getAddressFromLatLng(coord);
                },
                open: function (event, ui) {
                    that.$txtMapSearch.siblings('.prettyInput').hide();
                },
                close: function () {
                    that.$txtMapSearch.siblings('.prettyInput').show();
                }
            });
            this.$txtMapSearch.autocomplete( "option", "appendTo", "#divMapOverlay")
        }

    },
    mapClick: function (event) {
        var that = this;
        if (this.clckTimeOut) {
            window.clearTimeout(this.clckTimeOut);
            that.clckTimeOut = null;
        }
        else {
            this.clckTimeOut = window.setTimeout(function () {
                that.singleClick(event);
            }, 500);
        }
    },
    singleClick: function (event) {
        if (this.clckTimeOut) {
            window.clearTimeout(this.clckTimeOut);
            this.clckTimeOut = null;
            this.$txtHdnGeography.val(event.latLng.lat() + ',' + event.latLng.lng());
            var coord = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
            this.getAddressFromLatLng(coord, true);
        }
    },
    // handle select event
    _handleSelectClick: function (e) {
        this._handleOkClick();
        return false;
    },

    //handle Ok click
    _handleOkClick: function (e) {
        if (typeof this.options.onSelect == 'function') this.options.onSelect(this.getValue());
        this.close();
    }

});