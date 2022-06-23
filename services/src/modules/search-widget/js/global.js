(function(){

    'use strict';

    /*
     * ====================
     * Search Widget Module
     * ====================
     * The search widget is a form which has an input search field and a submit button.
     * 
     * When hover events happen on the form, or focus events happen on the input search field and submit button:
     * Classes are removed and added to the parent of the widget.
     * For example, the search widget is embedded in the header util bar.
     * On desktop, the search widget appears as a magnifying glass icon only.
     * If the classes are applied to the parent:
     * - other widgets in the header util bar are hidden 
     * - the search field input is visible
     * 
     */

    var qg_search_widget_module = (function() {
    
        function setupField() {

            // Bind focused event to field
            qg_search_widget_module.dom.$field.on("focus", function(event) {

                // Add class to parent so that not only field can show but hide other widgets in util bar as well
                qg_search_widget_module.dom.$parent.addClass("search-form-widget--focused");

            });


            // Bind blured event to field
            qg_search_widget_module.dom.$field.on("blur", function(event) {

                // Remove class to hide search field and show other widgets
                qg_search_widget_module.dom.$parent.removeClass("search-form-widget--focused");
                
            });

            // Because of how iOS handles blur (clicking on outside of the field doesn't blur a focused field)
            // We need this to simulate a focus blur when clicking elsewhere
            $(document).on("touchstart", function (event) {

                // Get this touched element
                var $this = $(event.target);
    
                // Check if element touched is not within the root
                if (qg_search_widget_module.dom.$field.is(":focus") && !$this.closest(qg_search_widget_module.dom.$root).length) {
                    
                    qg_search_widget_module.dom.$field.blur();

                }

            });

        }

        function setupToggleButton() {

            // Bind click event
            qg_search_widget_module.dom.$button_toggle.on("click", function(event) {

                qg_search_widget_module.dom.$parent.addClass("search-form-widget--focused");
                qg_search_widget_module.dom.$field.focus();

            });

        }

        function setupSubmitButton() {

            // Bind mousedown event 
            // Can't use click event. Has to capture event before blur event loses focus on the submit button
            qg_search_widget_module.dom.$button_submit.on("mousedown", function(event){

                event.preventDefault();

                qg_search_widget_module.dom.$form.submit();

            });

        }

        function cacheElements() {

            // Get input search field element
            qg_search_widget_module.dom.$field = qg_search_widget_module.dom.$root.find(".qg-search-widget__field");

            // Get form element
            qg_search_widget_module.dom.$form = qg_search_widget_module.dom.$root.find(".qg-search-widget__form");

            // Get submit button element
            qg_search_widget_module.dom.$button_submit = qg_search_widget_module.dom.$root.find(".qg-search-widget__btn-submit");

            // Get toggle button element
            qg_search_widget_module.dom.$button_toggle = qg_search_widget_module.dom.$root.find(".qg-search-widget__btn-toggle");

            // Get parent element
            qg_search_widget_module.dom.$parent = qg_search_widget_module.dom.$root.parent();

        }

        // Initialisation
        function init() {
            
            qg_search_widget_module.dom = {};

            // Get root node
            qg_search_widget_module.dom.$root = $(".qg-search-widget");
            
            // If search widget exists
            if (qg_search_widget_module.dom.$root.length) {

                cacheElements();

                setupField();

                setupToggleButton();

                setupSubmitButton();

            }
            
        }
        
        var qg_search_widget = {};
        var hover_class = "search-form-widget--hover";
        var active_class = "search-form-widget--focused";

        return {
            init: init
        }
    
    }());
    
    // When dom is ready
    document.addEventListener("DOMContentLoaded", function() {

        // Initialise the module
        qg_search_widget_module.init(); 

    });

}());
