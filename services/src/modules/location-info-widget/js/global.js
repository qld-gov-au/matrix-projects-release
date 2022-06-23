(function(){

    'use strict';

     /*
     * ===========================
     * Location Info Widget Module
     * ===========================
     * This widget module deals with displaying the user's current suburb 
     * It also allows the user to manually select a suburb through a modal popup form
     * 
     */

    var qg_location_info_widget_module = (function() {

        function closeModal() {
            qg_location_info_widget.dom.$modal.modal('hide');
        }

        function shakeModalForm() {
            // Add animation class to make form shake
            qg_location_info_widget.dom.$form_wrapper.addClass("shake");

            // Clear animation
            clearTimeout(remove_shake_class_timeout);
            remove_shake_class_timeout = setTimeout(function(){ qg_location_info_widget.dom.$form_wrapper.removeClass("shake"); }, 750);
        }

        function setupModalDetectLocationButton() {

            qg_location_info_widget.dom.$detect_location_btn.click(function(event) {

                qg_user_location_module.geolocate();

            });

        }

        function setupModalSetLocationButton() {

            qg_location_info_widget.dom.$set_location_btn.click(function(event) {

                var current_value = qg_location_info_widget.dom.$modal_input.val();

                // Check if inputted value is at least one of the suburb list items
                // Need trim here because HTML formatting of list items may include spaces
                var selected_suburb_list_item = qg_location_info_widget.dom.$suburb_list_items.filter(function() {
                    return $(this).text().toLowerCase().trim() === current_value.toLowerCase().trim();
                });

                // If inputted value exists in the suburb list
                if (selected_suburb_list_item.length) {
                    
                    var selected_suburb_list_item_array = current_value.split(", ");

                    var selected_suburb = selected_suburb_list_item_array[0];
                    var selected_lga = selected_suburb_list_item_array[1];

                    // Emit event
                    qg_user_location_module.event.emit("area manually selected", selected_suburb, selected_lga);

                    // Dismiss the modal
                    closeModal();

                } else {
                   
                    // Shake the form to alert user
                    shakeModalForm();

                }

            });
            
        }

        function hideSuburbList() {
            qg_location_info_widget.dom.$suburb_list_items.addClass("hidden");
            qg_location_info_widget.dom.$modal.removeClass("qg-location-info__modal--has-result");
        }

        function filterSuburbListItems(value) {

            var filtered_suburb_list_items = qg_location_info_widget.dom.$suburb_list_items.filter(function() {
                
                // Trim is because HTML might have spaces when formatting tags nicely
                return $(this).text().toLowerCase().trim().indexOf(value.toLowerCase().trim()) === 0                

            });

            return filtered_suburb_list_items;

        }

        function filterSuburbList(filter_value) {

            var filtered_suburb_list_items = filterSuburbListItems(filter_value);
            
            if (filtered_suburb_list_items.length) {
                filtered_suburb_list_items.removeClass("hidden");
                qg_location_info_widget.dom.$suburb_list_items.not(filtered_suburb_list_items).addClass("hidden");
                qg_location_info_widget.dom.$modal.addClass("qg-location-info__modal--has-result");
            } else {
                hideSuburbList();
            }

        }

        // Setup dropdown sububrb list items
        function setupSuburbListItemLinks() {

            // Can't use click because focus event happens before click
            qg_location_info_widget.dom.$suburb_list_items_links.on("mousedown", function(event) {

                var $this = $(event.target);

                var current_value = $this.text().trim();

                qg_location_info_widget.dom.$modal_input.val(current_value);

            });

            qg_location_info_widget.dom.$suburb_list_items_links.on("click", function(event) {

                event.preventDefault();
                event.stopPropagation();

                var $this = $(event.target);

                $this.blur();

            });

            qg_location_info_widget.dom.$suburb_list_items_links.on("focus", function(event) {

                var $this = $(event.target);

                var focused_item_value = $this.text().trim();
            
                qg_location_info_widget.dom.$modal.addClass("qg-location-info__modal--suburb-list-item-focused");

                qg_location_info_widget.dom.$modal_input.val(focused_item_value);

            });

            qg_location_info_widget.dom.$suburb_list_items_links.on("blur", function(event) {

                qg_location_info_widget.dom.$modal.removeClass("qg-location-info__modal--suburb-list-item-focused");

            });

            // When user is using keyboard up and down keys to navigate through the list
            qg_location_info_widget.dom.$suburb_list_items_links.on("keydown", function(event) {

                var $this = $(event.target);

                var keycode_pressed = event.which;
                
                // If up or down key is pressed
                if (keycode_pressed === 40 || keycode_pressed === 38 || keycode_pressed === 13) {

                     // Prevent screen from scrolling
                    event.preventDefault();

                    event.stopPropagation();

                    if (keycode_pressed === 40) {
                    
                        // If press down
                        var $next_visible_suburb_list_item = $this.parent().nextAll().not(".hidden").first();
    
                        // If theres a next visible suburb list item
                        if ($next_visible_suburb_list_item.length) {
    
                            // Focus on next visible element
                            $next_visible_suburb_list_item.find(qg_location_info_widget.dom.$suburb_list_items_links).focus();
    
                        }
    
                    } else if (keycode_pressed === 38) {
    
                        // If pressed up
    
                        // If theres a prev visible suburb list item
                        var $prev_visible_suburb_list_item = $this.parent().prevAll().not(".hidden").first();
    
                        if ($prev_visible_suburb_list_item.length) {
    
                            // Focus on next visible element
                            $prev_visible_suburb_list_item.find(qg_location_info_widget.dom.$suburb_list_items_links).focus();
    
                        }
    
                    } else if (keycode_pressed === 13) {

                        // If enter key is pressed
                        // Focus on field so user can press enter again
                        qg_location_info_widget.dom.$modal_input.focus();

                    }

                }
                
            });

        }
 
        // Setup input field of modal
        function setupModalInput() {

            // On input, check how many chars in input.
            // If more than set number of characters, perform filtering of sububrb list items
            qg_location_info_widget.dom.$modal_input.on("input", function(event) {

                var $this = $(event.target);

                var current_value = $this.val();

                if (current_value.length > 2) {
                    filterSuburbList(current_value);
                } else {
                    hideSuburbList();
                }

            });

            // On focus of input
            qg_location_info_widget.dom.$modal_input.on("focus", function(event) {
                
                // Trigger fake input
                // This is needed in the scenario that if a user is tab/keyboard focusing through the list and then blurs and then focus again
                // It needs to filter the list
                qg_location_info_widget.dom.$modal_input.trigger("input");

                // Add class
                qg_location_info_widget.dom.$modal.addClass("qg-location-info__modal--focused");

            });

            // On blur of input
            qg_location_info_widget.dom.$modal_input.on("blur", function(event) {

                // Remove class
                qg_location_info_widget.dom.$modal.removeClass("qg-location-info__modal--focused");

            });


            // If down or enter key is pressed
            qg_location_info_widget.dom.$modal_input.on("keydown", function(event) {

                var $this = $(event.target);

                // Get keycode pressed
                var keycode_pressed = event.which;
                
                if (keycode_pressed === 40 || keycode_pressed === 13) {

                    // Prevent screen when pressing down from scrolling
                    event.preventDefault();

                    event.stopPropagation();

                    // If down key
                    if (keycode_pressed === 40) {

                        // Get visible suburb list items 
                        var $first_visible_suburb_list_item = qg_location_info_widget.dom.$suburb_list_items.not(".hidden").first();
                        
                        // If exists, then focus on link
                        if ($first_visible_suburb_list_item.length) {

                            // Focus on link
                            $first_visible_suburb_list_item.find(qg_location_info_widget.dom.$suburb_list_items_links).focus();

                        }
                        
                    } else if (keycode_pressed === 13) {

                        // Enter key is pressed
                        qg_location_info_widget.dom.$set_location_btn.trigger("click");

                    }

                }
                

            });

        }

        function setupModal() {

            // Clear field when modal is dismissed
            qg_location_info_widget.dom.$modal.on('hidden.bs.modal', function () {
                qg_location_info_widget.dom.$modal_input.val("");
                hideSuburbList();
            });

        }

        function processLocation(location) {

            var location_name_text;
            
            // Get country from location object
            var country = location.country;
            
            // If theres a country value
            if (country) {
                
                // If in Australia
                if (country === "Australia") {

                    var state = location.state;

                    // If in Queensland
                    if (state === "QLD") {

                        // Display location as QLD suburb
                        location_name_text = location.suburb;

                    } else {

                        // Display location as state
                        // Applies to interstate e.g. NSW, VIC
                        location_name_text = state;

                    }

                } else {

                    // Display location as country
                    location_name_text = country;

                }

            } else {

                location_name_text = "Unknown";
  
            }

            // Update location link text
            qg_location_info_widget.dom.$link.text(location_name_text);

        }

        // When location is set by the user location module
        function updateModalInput(location) {

            // If modal is open and state is QLD
            if (location.state === "QLD" && qg_location_info_widget.dom.$modal.hasClass("show")) {

                var detected_suburb = location.suburb;
                var detected_lga = location.lga;

                // Find how many list items show with result from Google Maps API
                // This is because some LGA names from Arcgis (used in dropdown) is different from Google maps
                // e.g. Gold Coast City vs City of Gold Coast
                
                // Check detected area against list of suburb items
                var detected_area = detected_suburb + ", " + detected_lga;

                // Get filtered suburb list items
                var filtered_suburb_list_items = filterSuburbListItems(detected_area);

                // If one result, that means Arcgis and Google Maps suburb and LGA match!
                if (filtered_suburb_list_items.length === 1) {

                    // Populate input with detected sububrb
                    qg_location_info_widget.dom.$modal_input.val(detected_area).trigger("input");

                } else {

                    // Populate input with detected sububrb and focus on field
                    // Trigger input event so that sububrb list can be shown
                    qg_location_info_widget.dom.$modal_input.val(detected_suburb).trigger("input").focus();

                }

            } else {

                // Shake modal form
                shakeModalForm();
                
            }

        }

        function subscribeToEvents() {

            qg_user_location_module.event.on("location set", processLocation);

            qg_user_location_module.event.on("location detection successful", updateModalInput);

            qg_user_location_module.event.on("location detection failed", shakeModalForm);

        }

        function cacheElements() {

            // Get widget link
            qg_location_info_widget.dom.$link = qg_location_info_widget.dom.$root.find(".qg-location-info-widget__link");
                            
            // Get Modal
            qg_location_info_widget.dom.$modal = $("#qg-location-info__modal");

            // Get form wrapper
            qg_location_info_widget.dom.$form_wrapper = qg_location_info_widget.dom.$modal.find(".qg-location-info__modal-form-wrapper");

            // Get field input in modal
            qg_location_info_widget.dom.$modal_input = qg_location_info_widget.dom.$form_wrapper.find(".qg-location-info__modal-field");

            // Get suburb list items
            qg_location_info_widget.dom.$suburb_list_items = qg_location_info_widget.dom.$form_wrapper.find(".qg-location-info__modal-suburb-list-item");

            // Get suurb list item links
            qg_location_info_widget.dom.$suburb_list_items_links = qg_location_info_widget.dom.$suburb_list_items.find(".qg-location-info__modal-suburb-list-item-link");

            // Get detect location button in modal
            qg_location_info_widget.dom.$detect_location_btn = qg_location_info_widget.dom.$form_wrapper.find(".qg-location-info__modal-btn-detect-location");

            // Get set location button in modal
            qg_location_info_widget.dom.$set_location_btn = qg_location_info_widget.dom.$modal.find(".qg-location-info__modal-btn-set-location");

        }

        function init() {
            
            qg_location_info_widget.dom = {};

            // Get root element
            qg_location_info_widget.dom.$root = $(".qg-location-info-widget");
            
            // If widget exists
            if (qg_location_info_widget.dom.$root.length) {

                subscribeToEvents();

                cacheElements();

                setupModal();

                setupModalInput();

                setupSuburbListItemLinks();

                setupModalDetectLocationButton();

                setupModalSetLocationButton();

                hideSuburbList();

            }
            
        }
        
        var qg_location_info_widget = {};

        // List to store suburb/ LGAs
        var area_list_array = [];

        var remove_shake_class_timeout;

        // Initialise this module only when the user location module is initiliased
        qg_user_location_module.event.on("user location module initialised", init);
        
    }());

}());
