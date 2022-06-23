(function() {
    
    'use strict';

    var franchise_breadcrumb_ellipses_module = (function() {

        // When the breadcrumb ellipses is clicked
        function breadcrumbEllipsesClicked(event) {
            
            event.preventDefault();
                
            // Remove breadcrumb ellipses from DOM
            $breadcrumb_ellipses.remove();
            
        }

        function init() {
            
            // Get franchise list item in the breadcrumbs (identified by a data attribute)
            var $franchise_list_item = $("li[data-franchise-page]");
            
            // If franchise list item exists
            if ($franchise_list_item.length) {
                
                // Get all siblings after the franchise item
                var $franchise_list_item_next_siblings = $franchise_list_item.nextAll();
                
                // If there is more than 1 sibling
                if ($franchise_list_item_next_siblings.length > 1) {
                    
                    // Prepare the breadcrumb ellipses DOM element
                    var ellipses_markup = '<li class="qg-breadcrumb__ellipses">';
                    ellipses_markup += '<a href="#" role="button" aria-pressed="false" aria-label="Reveal hidden breadcrumbs" data-analytics-link-group="dfv-breadcrumbs">';
                    ellipses_markup += '...';
                    ellipses_markup += '</a>';
                    ellipses_markup += '</li>';

                    $breadcrumb_ellipses = $(ellipses_markup);
                    
                    // Insert it after the franchise breacrumb item and attach a click handler
                    $breadcrumb_ellipses.insertAfter($franchise_list_item).click(breadcrumbEllipsesClicked);
                    
                }
                
            }
            
        }
        
        var $breadcrumb_ellipses; // To store a prepared DOM element to insert after the franchise list item
        
        return {
            init: init
        }
        
    }());

    // Initiate module
    document.addEventListener("DOMContentLoaded", function() {
        franchise_breadcrumb_ellipses_module.init();
    });
    
}());

