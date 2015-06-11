window.hfl.Views.AutocompleteView = Backbone.View.extend({
    //the element to which autosuggest has to be bound. Should be a hidden input field.
    element: '',

    //the target to fire search query for populating autosuggest field
    target: '',

    //DOM  container of autosuggest element
    container: '',

    //default options
    options:
    {
        entity: '',
        placeholder: "Select a value",
        cssClass: '',
        itemTemplate: '',
        allowAddNew: false,
        allowViewList: false,
        modalContainer: '',
        onLoad: function () {
        },
        onSearch: function (term, responseCallback) {

        },
        onSelect: function (selectedOption) {

        },
        onAdd: function () {
           
        },
        onViewFullList: function () {

        },
        escapeMarkup: function (m) {
            return m;
        }


    },

    //this function is called after plugin has been loaded
    initialize: function (options) {

        this._validateAutosuggestOptions(options.element, options.target, options.options);
        this._bindAutocomplete();
        this._setDropDownListFormat(); // this adds appropriate classes and appends links to dropdown list

        if (this.options.onLoad && _.isFunction(this.options.onLoad)) {
            this.options.onLoad();
        }
    },

    _setDropDownListFormat: function () {
        $(this.container).addClass('form-control');
    },   
    

    _bindAutocomplete: function () {
        var that = this;

        //set autocomplete plugin options
        var autocomplete_options = this._setAutosuggestOptions();
        //bind autosuggest dropdown
        this.container = $(this.element, this.target).select2(autocomplete_options)
            .on('change', function (val) {
                that.options.onSelect(val.added);
            })
            .parent().find('.select2-container');

    },

    _setAutosuggestOptions: function () {
        var that = this;

        var autocomplete_options = {};
        //  autocomplete_options.data = data;
        autocomplete_options.containerCssClass = this.options.cssClass;
        autocomplete_options.placeholder = this.options.placeholder;
        autocomplete_options.formatInputTooShort = "Start typing to select..";
        if (this.options.itemTemplate && this.options.itemTemplate != '') {

            var itemTemplate = Handlebars.compile(that.options.itemTemplate);

            var format = function (item) {
                return itemTemplate(item.attributes || item);
            };

            // format of results in dropdown list
            autocomplete_options.formatResult = format

            // if needed to format of result selected
            autocomplete_options.formatSelection = format
        }

        var onEnter = function (e) {
            if (e.keyCode === 13) {
                that.container.select2('close');
                that.options.onAdd(e.currentTarget.value);
            }
        };


        if (this.options.allowAddNew) {
            autocomplete_options.formatNoMatches = function () {
                $('.select2-actions').remove();
                var inp = $('#' + $(that.element, that.target).select2('container').find('input').attr('id') + '_search');
                inp.unbind('keyup', onEnter).bind('keyup', onEnter);
                return "Press enter to Add New";
            };
        }

        var both = false;
        
        autocomplete_options.allowClear = true;

        if (!_.isEmpty(this.options.data)) {
            autocomplete_options.data = this.options.data;
        } else {
            autocomplete_options.minimumInputLength = 2;
            
            // add debounce to search to reduce number of events fired
            var lazySearch = _.debounce(

                function (query) {
                    $('.select2-actions').remove();

                    that.options.onSearch(query.term, function (results) {
                        $('.select2-actions').remove();

                        var queryData = { results: results };
                        query.callback(queryData);
                        var inp = $('#' + $(that.element, that.target).select2('container').find('input').attr('id') + '_search');
                        inp.unbind('onEnter');
                        if (results && results.length > 0 && inp.val().length > 1) {

                            if (that.options.allowAddNew || that.options.allowViewList) {

                                var html = '<li class="select2-actions">';
                                
                                inp.closest('.select2-drop').find('.select2-results').append(html + '</li>');
                            }
                        }
                    });
                }, 0);

            autocomplete_options.query = function (query) {
                lazySearch(query);
            };

        };
        return autocomplete_options;
    },

    _validateAutosuggestOptions: function (element, target, options) {

        //throws error if autosuggest is not bound to any element
        if (_.isNull(element) || element == '') {
            throw Error("No element defined for autosuggest");
        }
        this.element = element;

        //throws an error if no target is specified to populate data in dropdown list
        if (_.isNull(target) || target == '') {
            throw Error("No source defined for autosuggest options to get populated");
        }
        this.target = target;

        //throws an error if a div for modal is not specified
        if (_.isNull(options.modalContainer) || options.modalContainer == '') {
            throw Error("Please specify a container div for popups");
        }
        this.options.modalContainer = options.modalContainer;

        this.options = $.extend({}, this.options, options);

        //if no placeholder is defined, set it based on entity
        if (options.entity && options.entity != '' && (options.placeholder == null || options.placeholder == '')) {
            this.options.placeholder = "Select a " + this.options.entity;
        }

    }
});