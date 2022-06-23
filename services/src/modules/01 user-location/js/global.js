(function(){

    'use strict';

    /*
     * ====================
     * User location Module
     * ====================
     * Detects the user's location either by:
     * - getting user's coordinate with HTML5 geolocation and query the Google Maps API; or
     * - query the Google Maps API with suburb and LGA (Local Government Area)
     * 
     * Once the user's location is detected, it can be saved to session storage as a JSON string.
     * User's location is an object with 6 properties
     * - lat
     * - lon
     * - suburb
     * - lga
     * - state
     * - country
     * 
     * EventEmitter2 (https://github.com/EventEmitter2/EventEmitter2) is used to broadcast events such as
     * - succesfully detected the user's location
     * - failing to detect the user's location
     * - setting the user's location
     * 
     * Other modules such as the following are subscribed to these events and will react:
     * - banner 
     * - nearest service center
     * - location info widget
     * - weather info widget 
     * 
     */

    window.qg_user_location_module = (function() {
        
        // Emit event fail to detect user's location
        function detectLocationFailed() {
            event.emit("location detection failed");
        }

        // Emit event user's location has been set
        function emitLocationSetEvent() {
            event.emit("location set", user_location.set);
        }

        // Check if user's location is stored in session storage
        function checkSessionStorage() {

            // Check session storage
            var user_location_session_storage = sessionStorage.getItem('user_location');

            // If exists
            if (user_location_session_storage !== null) {

                // Parse the string into a JSON object
                var user_location_session_storage_json = JSON.parse(user_location_session_storage);

                // Set location details
                user_location.set.lat     = user_location_session_storage_json.lat;
                user_location.set.lon     = user_location_session_storage_json.lon;
                user_location.set.suburb  = user_location_session_storage_json.suburb;
                user_location.set.lga     = user_location_session_storage_json.lga;
                user_location.set.state   = user_location_session_storage_json.state;
                user_location.set.country = user_location_session_storage_json.country;

                return true;

            } else {

                return false;

            }
            
        }

        // Set Location
        function setLocation() {

            user_location.set.lat = user_location.detected.lat;
            user_location.set.lon = user_location.detected.lon;
            user_location.set.suburb = user_location.detected.suburb;
            user_location.set.lga = user_location.detected.lga;
            user_location.set.state = user_location.detected.state;
            user_location.set.country = user_location.detected.country;
            
            // Store location object in session storage
            sessionStorage.setItem("user_location", JSON.stringify(user_location.set));

        }

        // Query the Google Maps AI has been successul
        function queryMapAPISuccessful(data) {

            // If successful request of location from Google
            if (data.status === "OK" && data.results.length) {

                // Get the first result item in the returned JSON
                var results = data.results[0];

                // Set latitutde
                user_location.detected.lat = results.geometry.location.lat;

                // Set longtitude - Note that google's data is spelt lng
                user_location.detected.lon = results.geometry.location.lng;

                // Get address component object
                var address_components = results.address_components;

                // Get subrb from locality object 
                var locality_obj = _.find(address_components, function(obj) { return obj.types.indexOf("locality") !== -1; });

                // If locality object exists
                if (locality_obj) {

                    // Set suburb
                    user_location.detected.suburb = locality_obj.long_name;

                }
                
                // Get LGA from Administrative Area Level 2 Object
                var admin_area_level_two_obj = _.find(address_components, function(obj) { return obj.types.indexOf("administrative_area_level_2") !== -1; });

                // If Administrative Area Level 2 Object exists
                if (admin_area_level_two_obj) {

                    // Set LGA
                    user_location.detected.lga = admin_area_level_two_obj.long_name;

                }

                // Get state from Administrative Area Level 1 Object
                var admin_area_level_one_obj = _.find(address_components, function(obj) { return obj.types.indexOf("administrative_area_level_1") !== -1; });

                // If Administrative Area Level 1 Object exists
                if (admin_area_level_one_obj) {

                    // Set state
                    user_location.detected.state = admin_area_level_one_obj.short_name;

                }

                // Get country from Country Object
                var country_obj = _.find(address_components, function(obj) { return obj.types.indexOf("country") !== -1; });

                // If Administrative Area Level 1 Object exists
                if (country_obj) {

                    // Set state
                    user_location.detected.country = country_obj.long_name;

                }

                // Emit detection of user's location is successful
                event.emit("location detection successful", user_location.detected)

            }

        }

        // Query Google Maps API endpoint to get current user location
        function queryMapAPI(parameters) {

            // Create full endpoint
            var endpoint_to_call = map_data_api + parameters;

            // Make the call
            return $.getJSON(endpoint_to_call, queryMapAPISuccessful);
                
        }

        // Locate user with suburb and LGA
        function geocode() {

            // Create address parameter to pass to endpoint
            var parameters = "&address=" + user_location.detected.suburb  + "," + user_location.detected.lga + ",qld";
            
            // Get user's current location from Google maps API
            return queryMapAPI(parameters);
            
        }

        // Locate user with coordinates
        function reverseGeocode() {

            // Create address parameter to pass to endpoint
            var parameters = "&address=" + user_location.detected.lat + "," + user_location.detected.lon;

            // Get user's current location from Google maps API
            return queryMapAPI(parameters);
            
        }

        // Check if suburb and LGA arguments are not the same as current location
        function checkArea(suburb, lga) {
            
            // If user's current location is not the same as suburb argument OR
            // If user's current lga is not the same as lga argument
            // Theres going to be some false positives such as Gold Coast City vs City of Gold Coast
            if (user_location.set.suburb !== suburb || user_location.set.lga !== lga) {

                // Set suburb agument as detected suburb
                user_location.detected.suburb = suburb;

                // Set LGA argument as detected LGA
                // This is needed in case Google doesn't know what LGA the suburb is in e.g. Hope Value suburb
                user_location.detected.lga = lga;
                
                // When geolocation is finished
                $.when( geocode() ).always(function() {
                    
                    // Set user's location
                    setLocation();
                    emitLocationSetEvent();
                    
                });
            
            }

        }

        // Use HTML5 geolocation to get user's coordinates
        function geolocate() {

            // Create a deferred promise
            var dfd = $.Deferred();

            // Check if browser can use HTML5 geolocation
            if ("geolocation" in navigator) {

                // Get current user's coordinates
                navigator.geolocation.getCurrentPosition(function(position) {
            
                    // Set coordinates
                    user_location.detected.lat = position.coords.latitude;
                    user_location.detected.lon = position.coords.longitude;
        
                    // When reverse geocoded finishes
                    $.when( reverseGeocode() ).done(function() {
                    
                        // Resolve the promise
                        dfd.resolve();
    
                    }).fail(function() {

                        // If failed to get results from Google Maps API
                        dfd.reject();
                        detectLocationFailed();

                    });
        
                },  function (error) {
                    
                    // If reverse geocoding failed
                    dfd.reject();
                    detectLocationFailed();

                });

            } else {

                // If Geolocation is not supported in browser
                dfd.reject();
                detectLocationFailed();

            }

            return dfd.promise();

        }

        // Initialise module
        function init() {

            // To store "set" location
            user_location.set = {};

            // To store "detected" location
            user_location.detected = {};

            // Emit init event so that other modules dependent on user's location can be initialised first before 
            // this module starts detecting/broadcasting the user's current location
            qg_user_location_module.event.emit("user location module initialised");

            // Check session storage to see if current location is stored in user's details
            if (checkSessionStorage()) {

                emitLocationSetEvent();

            } else {

                // Get user's coordinates with HTML5 geolocation so that we can reverse geocode
                $.when( geolocate() ).always(function() {
                    
                    // Set user's location
                    setLocation();
                    emitLocationSetEvent();

                });

            }

        }

        var user_location = {};

        // Call Matrix REST Resource which makes a GET request to Google Maps API
        // This REST Resource as a middle layer because we don't want the API key to be expoed on the front end
        var map_data_api = "https://www.qld.gov.au/_qgdesigns/integrations/services/rest/google-maps-api?SQ_ASSET_CONTENTS_RAW";

        // Create event emitter object
        // This is an important object which deals with location related events 
        // Allows modules to react to these events
        var event = new EventEmitter2({
         
            maxListeners: 20,
            verboseMemoryLeak: true
        
        });

        // On suburb / lga manually selected from the location info widget
        event.on("area manually selected", checkArea);

        // Public API
        return {
            init: init,
            event: event,
            geolocate: geolocate
        }

    }());

    // On DOM Ready
    document.addEventListener("DOMContentLoaded", function() {
        
        // Initialise module
        qg_user_location_module.init();
         
    });

}());
