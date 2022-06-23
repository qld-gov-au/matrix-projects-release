(function(){

    'use strict';

     /*
     * ======================
     * Main Navigation Module
     * ======================
     * The main navigation has parent menu items, each with its own sub menu
     * 
     * ---------------------------
     * Functionality - Mobile mode
     * ---------------------------
     * When mobile mode is made active by clicking on the hamburger menu, a class is added to the body tag.
     * This allows the main body overflow-y to be hidden which disallows users to scroll whatever is behind the
     * expanded menu.
     * 
     * --------------------------------------
     * Functionality - Focused dropdown links
     * --------------------------------------
     * For better keyboard navigation, the dropdown stays open when user focuses on a dropdown link
     * 
     */

    var qg_main_nav_module = (function() {
        
        function setupMobileMode() {

            // Get hamburger menu
            var $mobile_nav_toggle = $(".qg-util-bar__mobile-nav-toggle");
            
            $mobile_nav_toggle.click(function(event) {
                
                var $this = $(event.target);

                // Toggle class on body
                $("body").toggleClass("mobile-nav-active");

            });

        }

        function setupDropdownLinks() {

            var focus_class = "qg-main-nav__dropdown-link--focused";

            // Get links in dropdown
            qg_main_nav.dom.$root.$submenu_links = qg_main_nav.dom.$root.find(".qg-main-nav__dropdown .qg-main-nav__menu-link");

            qg_main_nav.dom.$root.$submenu_links.on("focus", function(event) {

                var $this = $(event.target);

                // Find parent menu item and add class
                $this.closest(".qg-main-nav__dropdown").parent().addClass(focus_class);

            });

            qg_main_nav.dom.$root.$submenu_links.on("blur", function(event) {

                var $this = $(event.target);

                // // Find parent menu item and remove class
                $this.closest(".qg-main-nav__dropdown").parent().removeClass(focus_class);

            });
            
        }

        // Initialisation
        function init() {
            
            qg_main_nav.dom = {};

            // Get root element
            qg_main_nav.dom.$root = $(".qg-main-nav");
            
            // If main navigation exists
            if (qg_main_nav.dom.$root.length) {

                setupMobileMode();

                setupDropdownLinks();
                
            }
            
        }
        
        var qg_main_nav = {};

        return {
            init: init
        }
    
    
    }());
    
    document.addEventListener("DOMContentLoaded", function() {
        qg_main_nav_module.init();
    });

}());
