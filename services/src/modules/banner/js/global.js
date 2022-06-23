(function(){

    'use strict';

    /*
     * ====================
     * Banner Module
     * ====================
     * 
     * This is a banner which has a dynamic background image depending on the user's current location.
     * When the user's location is  set by the user location module, the banner image related to the user's LGA is picked.
     * 
     * If the user's location LGA is not valid, a random image is picked.
     * 
     */

    var services_banner_module = (function() {
    
        // Function to generate random numbers
        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        // Update he banner image
        function updateBanner(image_url, caption) {

            // Modify the background-image CSS 
            // Add class so that the caption can be shown
            services_banner.dom.$root.css("background-image", "url(" + image_url + ")").addClass("services-banner--banner-selected");

            // Update the banner caption
            services_banner.dom.$caption_text.text(caption);

        }

        // Set banner by looking at user's lga and banner JSON list
        function setBanner(location) {

            if (location.state === "QLD") {

                // Get the LGA
                var current_location_lga = location.lga;

                // Check if any banners in the banner JSON list contains this LGA
                var filtered_banner = _.find(banners_list, function(obj) {return  obj.lgas.indexOf(current_location_lga) !== -1 });

                // If theres a banner
                if (filtered_banner) {
                    
                    // Update banner image and caption
                    updateBanner(filtered_banner.url, filtered_banner.caption);

                } else {
                    
                    // No banner found
                    // This means the LGA from Google didnt not match any LGAs in any banner
                    // Pick a random banner as a fallback
                    randomiseBanner();

                }

            } else {

                // Not a Queensland state or no LGA value
                // This can happen if user blocks geolocation when loading the page
                randomiseBanner();

            }
            
        }

        // In the event the user's location could not be detected or no banner is found related to the user's LGA
        // Pick a random banner
        function randomiseBanner() {

            // Get total number of banners in banner list
            var banner_count = banners_list.length;

            // Generate a random number
            var random_image_index = getRandomInt(banner_count);

            // Get random banner url
            var random_banner_url = banners_list[random_image_index].url;

            // Get random banner caption
            var random_banner_caption = banners_list[random_image_index].caption;

            // Update banner with random banner image and caption
            updateBanner(random_banner_url, random_banner_caption);

        }

        // Subscribe to eventemitter2 events
        function subscribeToEvents() {

            // When location is set, pick a banner from the JSON list
            qg_user_location_module.event.on("location set", setBanner);

        }

        function cacheElements() {
            
            // Get caption text node
            services_banner.dom.$caption_text = services_banner.dom.$root.find(".services-banner__caption-text");

        }
        
        // Initialise module
        function init() {
            
            services_banner.dom = {};

            // Get root node
            services_banner.dom.$root = $(".services-banner");
            
            // If root node exists
            if (services_banner.dom.$root.length) {

                subscribeToEvents()

                cacheElements();

                // Get banner list JSON from data attribute
                banners_list = services_banner.dom.$root.data("banners-list");

            }
            
        }
        
        var services_banner = {};
        
        // Variable to store banner list JSON which is stored in a data attribute on the root node
        var banners_list;

        // When user location module has initialised, initialise this module
        qg_user_location_module.event.on("user location module initialised", init);
            
    }());
    
}());
