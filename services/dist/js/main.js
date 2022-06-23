(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],[
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(12);
__webpack_require__(13);
__webpack_require__(14);
__webpack_require__(15);
module.exports = __webpack_require__(16);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_global_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _styles_global_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_global_scss__WEBPACK_IMPORTED_MODULE_0__);
// CSS


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 3 */
/***/ (function(module, exports) {



/***/ }),
/* 4 */
/***/ (function(module, exports) {

(function () {
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

  window.qg_user_location_module = function () {
    // Emit event fail to detect user's location
    function detectLocationFailed() {
      event.emit("location detection failed");
    } // Emit event user's location has been set


    function emitLocationSetEvent() {
      event.emit("location set", user_location.set);
    } // Check if user's location is stored in session storage


    function checkSessionStorage() {
      // Check session storage
      var user_location_session_storage = sessionStorage.getItem('user_location'); // If exists

      if (user_location_session_storage !== null) {
        // Parse the string into a JSON object
        var user_location_session_storage_json = JSON.parse(user_location_session_storage); // Set location details

        user_location.set.lat = user_location_session_storage_json.lat;
        user_location.set.lon = user_location_session_storage_json.lon;
        user_location.set.suburb = user_location_session_storage_json.suburb;
        user_location.set.lga = user_location_session_storage_json.lga;
        user_location.set.state = user_location_session_storage_json.state;
        user_location.set.country = user_location_session_storage_json.country;
        return true;
      } else {
        return false;
      }
    } // Set Location


    function setLocation() {
      user_location.set.lat = user_location.detected.lat;
      user_location.set.lon = user_location.detected.lon;
      user_location.set.suburb = user_location.detected.suburb;
      user_location.set.lga = user_location.detected.lga;
      user_location.set.state = user_location.detected.state;
      user_location.set.country = user_location.detected.country; // Store location object in session storage

      sessionStorage.setItem("user_location", JSON.stringify(user_location.set));
    } // Query the Google Maps AI has been successul


    function queryMapAPISuccessful(data) {
      // If successful request of location from Google
      if (data.status === "OK" && data.results.length) {
        // Get the first result item in the returned JSON
        var results = data.results[0]; // Set latitutde

        user_location.detected.lat = results.geometry.location.lat; // Set longtitude - Note that google's data is spelt lng

        user_location.detected.lon = results.geometry.location.lng; // Get address component object

        var address_components = results.address_components; // Get subrb from locality object 

        var locality_obj = _.find(address_components, function (obj) {
          return obj.types.indexOf("locality") !== -1;
        }); // If locality object exists


        if (locality_obj) {
          // Set suburb
          user_location.detected.suburb = locality_obj.long_name;
        } // Get LGA from Administrative Area Level 2 Object


        var admin_area_level_two_obj = _.find(address_components, function (obj) {
          return obj.types.indexOf("administrative_area_level_2") !== -1;
        }); // If Administrative Area Level 2 Object exists


        if (admin_area_level_two_obj) {
          // Set LGA
          user_location.detected.lga = admin_area_level_two_obj.long_name;
        } // Get state from Administrative Area Level 1 Object


        var admin_area_level_one_obj = _.find(address_components, function (obj) {
          return obj.types.indexOf("administrative_area_level_1") !== -1;
        }); // If Administrative Area Level 1 Object exists


        if (admin_area_level_one_obj) {
          // Set state
          user_location.detected.state = admin_area_level_one_obj.short_name;
        } // Get country from Country Object


        var country_obj = _.find(address_components, function (obj) {
          return obj.types.indexOf("country") !== -1;
        }); // If Administrative Area Level 1 Object exists


        if (country_obj) {
          // Set state
          user_location.detected.country = country_obj.long_name;
        } // Emit detection of user's location is successful


        event.emit("location detection successful", user_location.detected);
      }
    } // Query Google Maps API endpoint to get current user location


    function queryMapAPI(parameters) {
      // Create full endpoint
      var endpoint_to_call = map_data_api + parameters; // Make the call

      return $.getJSON(endpoint_to_call, queryMapAPISuccessful);
    } // Locate user with suburb and LGA


    function geocode() {
      // Create address parameter to pass to endpoint
      var parameters = "&address=" + user_location.detected.suburb + "," + user_location.detected.lga + ",qld"; // Get user's current location from Google maps API

      return queryMapAPI(parameters);
    } // Locate user with coordinates


    function reverseGeocode() {
      // Create address parameter to pass to endpoint
      var parameters = "&address=" + user_location.detected.lat + "," + user_location.detected.lon; // Get user's current location from Google maps API

      return queryMapAPI(parameters);
    } // Check if suburb and LGA arguments are not the same as current location


    function checkArea(suburb, lga) {
      // If user's current location is not the same as suburb argument OR
      // If user's current lga is not the same as lga argument
      // Theres going to be some false positives such as Gold Coast City vs City of Gold Coast
      if (user_location.set.suburb !== suburb || user_location.set.lga !== lga) {
        // Set suburb agument as detected suburb
        user_location.detected.suburb = suburb; // Set LGA argument as detected LGA
        // This is needed in case Google doesn't know what LGA the suburb is in e.g. Hope Value suburb

        user_location.detected.lga = lga; // When geolocation is finished

        $.when(geocode()).always(function () {
          // Set user's location
          setLocation();
          emitLocationSetEvent();
        });
      }
    } // Use HTML5 geolocation to get user's coordinates


    function geolocate() {
      // Create a deferred promise
      var dfd = $.Deferred(); // Check if browser can use HTML5 geolocation

      if ("geolocation" in navigator) {
        // Get current user's coordinates
        navigator.geolocation.getCurrentPosition(function (position) {
          // Set coordinates
          user_location.detected.lat = position.coords.latitude;
          user_location.detected.lon = position.coords.longitude; // When reverse geocoded finishes

          $.when(reverseGeocode()).done(function () {
            // Resolve the promise
            dfd.resolve();
          }).fail(function () {
            // If failed to get results from Google Maps API
            dfd.reject();
            detectLocationFailed();
          });
        }, function (error) {
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
    } // Initialise module


    function init() {
      // To store "set" location
      user_location.set = {}; // To store "detected" location

      user_location.detected = {}; // Emit init event so that other modules dependent on user's location can be initialised first before 
      // this module starts detecting/broadcasting the user's current location

      qg_user_location_module.event.emit("user location module initialised"); // Check session storage to see if current location is stored in user's details

      if (checkSessionStorage()) {
        emitLocationSetEvent();
      } else {
        // Get user's coordinates with HTML5 geolocation so that we can reverse geocode
        $.when(geolocate()).always(function () {
          // Set user's location
          setLocation();
          emitLocationSetEvent();
        });
      }
    }

    var user_location = {}; // Call Matrix REST Resource which makes a GET request to Google Maps API
    // This REST Resource as a middle layer because we don't want the API key to be expoed on the front end

    var map_data_api = "https://www.qld.gov.au/_qgdesigns/integrations/services/rest/google-maps-api?SQ_ASSET_CONTENTS_RAW"; // Create event emitter object
    // This is an important object which deals with location related events 
    // Allows modules to react to these events

    var event = new EventEmitter2({
      maxListeners: 20,
      verboseMemoryLeak: true
    }); // On suburb / lga manually selected from the location info widget

    event.on("area manually selected", checkArea); // Public API

    return {
      init: init,
      event: event,
      geolocate: geolocate
    };
  }(); // On DOM Ready


  document.addEventListener("DOMContentLoaded", function () {
    // Initialise module
    qg_user_location_module.init();
  });
})();

/***/ }),
/* 5 */
/***/ (function(module, exports) {

(function () {
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

  var services_banner_module = function () {
    // Function to generate random numbers
    function getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    } // Update he banner image


    function updateBanner(image_url, caption) {
      // Modify the background-image CSS 
      // Add class so that the caption can be shown
      services_banner.dom.$root.css("background-image", "url(" + image_url + ")").addClass("services-banner--banner-selected"); // Update the banner caption

      services_banner.dom.$caption_text.text(caption);
    } // Set banner by looking at user's lga and banner JSON list


    function setBanner(location) {
      if (location.state === "QLD") {
        // Get the LGA
        var current_location_lga = location.lga; // Check if any banners in the banner JSON list contains this LGA

        var filtered_banner = _.find(banners_list, function (obj) {
          return obj.lgas.indexOf(current_location_lga) !== -1;
        }); // If theres a banner


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
    } // In the event the user's location could not be detected or no banner is found related to the user's LGA
    // Pick a random banner


    function randomiseBanner() {
      // Get total number of banners in banner list
      var banner_count = banners_list.length; // Generate a random number

      var random_image_index = getRandomInt(banner_count); // Get random banner url

      var random_banner_url = banners_list[random_image_index].url; // Get random banner caption

      var random_banner_caption = banners_list[random_image_index].caption; // Update banner with random banner image and caption

      updateBanner(random_banner_url, random_banner_caption);
    } // Subscribe to eventemitter2 events


    function subscribeToEvents() {
      // When location is set, pick a banner from the JSON list
      qg_user_location_module.event.on("location set", setBanner);
    }

    function cacheElements() {
      // Get caption text node
      services_banner.dom.$caption_text = services_banner.dom.$root.find(".services-banner__caption-text");
    } // Initialise module


    function init() {
      services_banner.dom = {}; // Get root node

      services_banner.dom.$root = $(".services-banner"); // If root node exists

      if (services_banner.dom.$root.length) {
        subscribeToEvents();
        cacheElements(); // Get banner list JSON from data attribute

        banners_list = services_banner.dom.$root.data("banners-list");
      }
    }

    var services_banner = {}; // Variable to store banner list JSON which is stored in a data attribute on the root node

    var banners_list; // When user location module has initialised, initialise this module

    qg_user_location_module.event.on("user location module initialised", init);
  }();
})();

/***/ }),
/* 6 */
/***/ (function(module, exports) {



/***/ }),
/* 7 */
/***/ (function(module, exports) {

(function () {
  'use strict';
})();

/***/ }),
/* 8 */
/***/ (function(module, exports) {

(function () {
  'use strict';
  /*
   * ======================
   * Nearest Service Centre
   * ======================
   * Deals with getting the closest service centre from Funnelback and displaying its details
   * Depends on receiving coordinates from the user location module
   * 
   */

  var qg_nearest_service_centre_module = function () {
    // The funnelback results returns a displayUrl result but no domain
    // Need to get the funnelback domain from the source API endpoint and concatenate with display url
    function generateLinkToCentreDetail() {
      // Get display url
      var display_url = nearest_service_centre_data.displayUrl; // Get funnelback domain from source url by splitting the URL into a string and getting everything before the ? char

      var fb_domain = nearest_service_center_data_source_url.split('?')[0];
      return fb_domain + display_url;
    }

    function updateCentreName() {
      // Get nearest centre name
      var nearest_centre_name = nearest_service_centre_data.title;
      var nearest_centre_link = generateLinkToCentreDetail(); // Update heading

      qg_nearest_service_centre.dom.$centre_name.text(nearest_centre_name); // Update link

      qg_nearest_service_centre.dom.$centre_name.prop("href", nearest_centre_link);
    }

    function updateServicesAvailable() {
      // If services key exists and is not empty, that means there are services at the nearest centre
      if (nearest_service_centre_data.metaData.hasOwnProperty('s') && nearest_service_centre_data.metaData.s.length) {
        var nearest_centre_link = generateLinkToCentreDetail(); // Update href property to be link to nearest service centre detail page

        qg_nearest_service_centre.dom.$services_available_link.prop("href", nearest_centre_link);
        qg_nearest_service_centre.dom.$services_available_wrapper.show();
      } else {
        clearServicesAvailable();
      }
    }

    function updateLocationDistanceFrom() {
      // If kmFromOrigin key exists and is not empty
      if (nearest_service_centre_data.hasOwnProperty('kmFromOrigin') && nearest_service_centre_data.kmFromOrigin.length) {
        var distance_from_origin = nearest_service_centre_data.kmFromOrigin + "km away";
        qg_nearest_service_centre.dom.$location_distance_from.text(distance_from_origin).show();
      } else {
        // Clear text and hide distance from origin text
        qg_nearest_service_centre.dom.$location_distance_from.hide().text("");
      }
    }

    function updatelocationAddress() {
      // Update address
      var address1 = nearest_service_centre_data.metaData.address1;
      var suburb = nearest_service_centre_data.metaData.suburb;
      var postcode = nearest_service_centre_data.metaData.postcode;
      var full_address = address1 + "<br />" + suburb + " " + postcode;
      qg_nearest_service_centre.dom.$location_address.html(full_address);
    } // Update location related details


    function updateLocation() {
      updateLocationDistanceFrom();
      updatelocationAddress();
    }

    function clearCentreName() {
      // Clear heading
      qg_nearest_service_centre.dom.$centre_name.text(""); // Change href property to be #

      qg_nearest_service_centre.dom.$centre_name.prop("href", "#");
    } // Clear services available link


    function clearServicesAvailable() {
      qg_nearest_service_centre.dom.$services_available_wrapper.hide();
      qg_nearest_service_centre.dom.$services_available_link.prop("href", "#");
    } // Clear location related details


    function clearLocation() {
      qg_nearest_service_centre.dom.$location_distance_from.text("");
      qg_nearest_service_centre.dom.$location_address.html("");
    } // Clear and hide details


    function clearDetails() {
      clearCentreName();
      clearServicesAvailable();
      clearLocation();
      qg_nearest_service_centre.dom.$root.removeClass("qg-site-footer-util__nearest-service-centre--has-result");
    } // Update nearest service centre details


    function getNearestServiceCentre(lat, lon) {
      // Create request url by adding coordinates as parameters
      var request_url = nearest_service_center_data_source_url + "&origin=" + lat + "%3B" + lon; // When the nearest service centre data is retrieved from source by passing in the user's coords

      return $.getJSON(request_url);
    }

    function updateDetails(lat, lon) {
      // When successfully get a the nearest service centre from endpoint
      $.when(getNearestServiceCentre(lat, lon)).done(function (data) {
        // If there are results
        if (data.hasOwnProperty('features') && data.features.length) {
          nearest_service_centre_data = data.features[0].properties;
          updateCentreName();
          updateServicesAvailable();
          updateLocation(); // Class to show nearest service centre details

          qg_nearest_service_centre.dom.$root.addClass("qg-site-footer-util__nearest-service-centre--has-result");
        }
      });
    } // Process the location to see if its Queensland


    function processLocation(location) {
      clearDetails(); // If in Queensland

      if (location.state === "QLD") {
        updateDetails(location.lat, location.lon);
      }
    }

    function subscribeToEvents() {
      qg_user_location_module.event.on("location set", processLocation);
    }

    function cacheElements() {
      // Cache centre name element
      qg_nearest_service_centre.dom.$centre_name = qg_nearest_service_centre.dom.$root.find(".qg-site-footer-util__nearest-service-centre-detail-name"); // Cache services available elements

      qg_nearest_service_centre.dom.$services_available_wrapper = qg_nearest_service_centre.dom.$root.find(".qg-site-footer-util__nearest-service-centre-detail-services-available");
      qg_nearest_service_centre.dom.$services_available_link = qg_nearest_service_centre.dom.$services_available_wrapper.find(".qg-site-footer-util__nearest-service-centre-detail-services-available-link"); // Cache location wrapper elements

      qg_nearest_service_centre.dom.$location_wrapper = qg_nearest_service_centre.dom.$root.find(".qg-site-footer-util__nearest-service-centre-detail-location");
      qg_nearest_service_centre.dom.$location_distance_from = qg_nearest_service_centre.dom.$location_wrapper.find(".qg-site-footer-util__nearest-service-centre-detail-distance-from");
      qg_nearest_service_centre.dom.$location_address = qg_nearest_service_centre.dom.$location_wrapper.find(".qg-site-footer-util__nearest-service-centre-detail-location-address");
    }

    function init() {
      qg_nearest_service_centre.dom = {}; // Get root element

      qg_nearest_service_centre.dom.$root = $(".qg-site-footer-util__nearest-service-centre"); // If widget exists

      if (qg_nearest_service_centre.dom.$root.length) {
        subscribeToEvents();
        cacheElements(); // Get API source data endpoint URL from data attribute on root node

        nearest_service_center_data_source_url = qg_nearest_service_centre.dom.$root.data("nearest-service-centre-source");
      }
    }

    var qg_nearest_service_centre = {}; // To store the nearest service centre data;

    var nearest_service_centre_data; // To store the FB endpoint which is found on the root nodes data attribute

    var nearest_service_center_data_source_url; // Initialise this module only when the user location module is initiliased

    qg_user_location_module.event.on("user location module initialised", init);
  }();
})();

/***/ }),
/* 9 */
/***/ (function(module, exports) {

(function () {
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

  var qg_main_nav_module = function () {
    function setupMobileMode() {
      // Get hamburger menu
      var $mobile_nav_toggle = $(".qg-util-bar__mobile-nav-toggle");
      $mobile_nav_toggle.click(function (event) {
        var $this = $(event.target); // Toggle class on body

        $("body").toggleClass("mobile-nav-active");
      });
    }

    function setupDropdownLinks() {
      var focus_class = "qg-main-nav__dropdown-link--focused"; // Get links in dropdown

      qg_main_nav.dom.$root.$submenu_links = qg_main_nav.dom.$root.find(".qg-main-nav__dropdown .qg-main-nav__menu-link");
      qg_main_nav.dom.$root.$submenu_links.on("focus", function (event) {
        var $this = $(event.target); // Find parent menu item and add class

        $this.closest(".qg-main-nav__dropdown").parent().addClass(focus_class);
      });
      qg_main_nav.dom.$root.$submenu_links.on("blur", function (event) {
        var $this = $(event.target); // // Find parent menu item and remove class

        $this.closest(".qg-main-nav__dropdown").parent().removeClass(focus_class);
      });
    } // Initialisation


    function init() {
      qg_main_nav.dom = {}; // Get root element

      qg_main_nav.dom.$root = $(".qg-main-nav"); // If main navigation exists

      if (qg_main_nav.dom.$root.length) {
        setupMobileMode();
        setupDropdownLinks();
      }
    }

    var qg_main_nav = {};
    return {
      init: init
    };
  }();

  document.addEventListener("DOMContentLoaded", function () {
    qg_main_nav_module.init();
  });
})();

/***/ }),
/* 10 */
/***/ (function(module, exports) {

(function () {
  'use strict';
})();

/***/ }),
/* 11 */
/***/ (function(module, exports) {

(function () {
  'use strict';
})();

/***/ }),
/* 12 */
/***/ (function(module, exports) {

(function () {
  'use strict';
  /*
  * ===========================
  * Location Info Widget Module
  * ===========================
  * This widget module deals with displaying the user's current suburb 
  * It also allows the user to manually select a suburb through a modal popup form
  * 
  */

  var qg_location_info_widget_module = function () {
    function closeModal() {
      qg_location_info_widget.dom.$modal.modal('hide');
    }

    function shakeModalForm() {
      // Add animation class to make form shake
      qg_location_info_widget.dom.$form_wrapper.addClass("shake"); // Clear animation

      clearTimeout(remove_shake_class_timeout);
      remove_shake_class_timeout = setTimeout(function () {
        qg_location_info_widget.dom.$form_wrapper.removeClass("shake");
      }, 750);
    }

    function setupModalDetectLocationButton() {
      qg_location_info_widget.dom.$detect_location_btn.click(function (event) {
        qg_user_location_module.geolocate();
      });
    }

    function setupModalSetLocationButton() {
      qg_location_info_widget.dom.$set_location_btn.click(function (event) {
        var current_value = qg_location_info_widget.dom.$modal_input.val(); // Check if inputted value is at least one of the suburb list items
        // Need trim here because HTML formatting of list items may include spaces

        var selected_suburb_list_item = qg_location_info_widget.dom.$suburb_list_items.filter(function () {
          return $(this).text().toLowerCase().trim() === current_value.toLowerCase().trim();
        }); // If inputted value exists in the suburb list

        if (selected_suburb_list_item.length) {
          var selected_suburb_list_item_array = current_value.split(", ");
          var selected_suburb = selected_suburb_list_item_array[0];
          var selected_lga = selected_suburb_list_item_array[1]; // Emit event

          qg_user_location_module.event.emit("area manually selected", selected_suburb, selected_lga); // Dismiss the modal

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
      var filtered_suburb_list_items = qg_location_info_widget.dom.$suburb_list_items.filter(function () {
        // Trim is because HTML might have spaces when formatting tags nicely
        return $(this).text().toLowerCase().trim().indexOf(value.toLowerCase().trim()) === 0;
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
    } // Setup dropdown sububrb list items


    function setupSuburbListItemLinks() {
      // Can't use click because focus event happens before click
      qg_location_info_widget.dom.$suburb_list_items_links.on("mousedown", function (event) {
        var $this = $(event.target);
        var current_value = $this.text().trim();
        qg_location_info_widget.dom.$modal_input.val(current_value);
      });
      qg_location_info_widget.dom.$suburb_list_items_links.on("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        var $this = $(event.target);
        $this.blur();
      });
      qg_location_info_widget.dom.$suburb_list_items_links.on("focus", function (event) {
        var $this = $(event.target);
        var focused_item_value = $this.text().trim();
        qg_location_info_widget.dom.$modal.addClass("qg-location-info__modal--suburb-list-item-focused");
        qg_location_info_widget.dom.$modal_input.val(focused_item_value);
      });
      qg_location_info_widget.dom.$suburb_list_items_links.on("blur", function (event) {
        qg_location_info_widget.dom.$modal.removeClass("qg-location-info__modal--suburb-list-item-focused");
      }); // When user is using keyboard up and down keys to navigate through the list

      qg_location_info_widget.dom.$suburb_list_items_links.on("keydown", function (event) {
        var $this = $(event.target);
        var keycode_pressed = event.which; // If up or down key is pressed

        if (keycode_pressed === 40 || keycode_pressed === 38 || keycode_pressed === 13) {
          // Prevent screen from scrolling
          event.preventDefault();
          event.stopPropagation();

          if (keycode_pressed === 40) {
            // If press down
            var $next_visible_suburb_list_item = $this.parent().nextAll().not(".hidden").first(); // If theres a next visible suburb list item

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
    } // Setup input field of modal


    function setupModalInput() {
      // On input, check how many chars in input.
      // If more than set number of characters, perform filtering of sububrb list items
      qg_location_info_widget.dom.$modal_input.on("input", function (event) {
        var $this = $(event.target);
        var current_value = $this.val();

        if (current_value.length > 2) {
          filterSuburbList(current_value);
        } else {
          hideSuburbList();
        }
      }); // On focus of input

      qg_location_info_widget.dom.$modal_input.on("focus", function (event) {
        // Trigger fake input
        // This is needed in the scenario that if a user is tab/keyboard focusing through the list and then blurs and then focus again
        // It needs to filter the list
        qg_location_info_widget.dom.$modal_input.trigger("input"); // Add class

        qg_location_info_widget.dom.$modal.addClass("qg-location-info__modal--focused");
      }); // On blur of input

      qg_location_info_widget.dom.$modal_input.on("blur", function (event) {
        // Remove class
        qg_location_info_widget.dom.$modal.removeClass("qg-location-info__modal--focused");
      }); // If down or enter key is pressed

      qg_location_info_widget.dom.$modal_input.on("keydown", function (event) {
        var $this = $(event.target); // Get keycode pressed

        var keycode_pressed = event.which;

        if (keycode_pressed === 40 || keycode_pressed === 13) {
          // Prevent screen when pressing down from scrolling
          event.preventDefault();
          event.stopPropagation(); // If down key

          if (keycode_pressed === 40) {
            // Get visible suburb list items 
            var $first_visible_suburb_list_item = qg_location_info_widget.dom.$suburb_list_items.not(".hidden").first(); // If exists, then focus on link

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
      var location_name_text; // Get country from location object

      var country = location.country; // If theres a country value

      if (country) {
        // If in Australia
        if (country === "Australia") {
          var state = location.state; // If in Queensland

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
      } // Update location link text


      qg_location_info_widget.dom.$link.text(location_name_text);
    } // When location is set by the user location module


    function updateModalInput(location) {
      // If modal is open and state is QLD
      if (location.state === "QLD" && qg_location_info_widget.dom.$modal.hasClass("show")) {
        var detected_suburb = location.suburb;
        var detected_lga = location.lga; // Find how many list items show with result from Google Maps API
        // This is because some LGA names from Arcgis (used in dropdown) is different from Google maps
        // e.g. Gold Coast City vs City of Gold Coast
        // Check detected area against list of suburb items

        var detected_area = detected_suburb + ", " + detected_lga; // Get filtered suburb list items

        var filtered_suburb_list_items = filterSuburbListItems(detected_area); // If one result, that means Arcgis and Google Maps suburb and LGA match!

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
      qg_location_info_widget.dom.$link = qg_location_info_widget.dom.$root.find(".qg-location-info-widget__link"); // Get Modal

      qg_location_info_widget.dom.$modal = $("#qg-location-info__modal"); // Get form wrapper

      qg_location_info_widget.dom.$form_wrapper = qg_location_info_widget.dom.$modal.find(".qg-location-info__modal-form-wrapper"); // Get field input in modal

      qg_location_info_widget.dom.$modal_input = qg_location_info_widget.dom.$form_wrapper.find(".qg-location-info__modal-field"); // Get suburb list items

      qg_location_info_widget.dom.$suburb_list_items = qg_location_info_widget.dom.$form_wrapper.find(".qg-location-info__modal-suburb-list-item"); // Get suurb list item links

      qg_location_info_widget.dom.$suburb_list_items_links = qg_location_info_widget.dom.$suburb_list_items.find(".qg-location-info__modal-suburb-list-item-link"); // Get detect location button in modal

      qg_location_info_widget.dom.$detect_location_btn = qg_location_info_widget.dom.$form_wrapper.find(".qg-location-info__modal-btn-detect-location"); // Get set location button in modal

      qg_location_info_widget.dom.$set_location_btn = qg_location_info_widget.dom.$modal.find(".qg-location-info__modal-btn-set-location");
    }

    function init() {
      qg_location_info_widget.dom = {}; // Get root element

      qg_location_info_widget.dom.$root = $(".qg-location-info-widget"); // If widget exists

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

    var qg_location_info_widget = {}; // List to store suburb/ LGAs

    var area_list_array = [];
    var remove_shake_class_timeout; // Initialise this module only when the user location module is initiliased

    qg_user_location_module.event.on("user location module initialised", init);
  }();
})();

/***/ }),
/* 13 */
/***/ (function(module, exports) {



/***/ }),
/* 14 */
/***/ (function(module, exports) {

(function () {
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

  var qg_search_widget_module = function () {
    function setupField() {
      // Bind focused event to field
      qg_search_widget_module.dom.$field.on("focus", function (event) {
        // Add class to parent so that not only field can show but hide other widgets in util bar as well
        qg_search_widget_module.dom.$parent.addClass("search-form-widget--focused");
      }); // Bind blured event to field

      qg_search_widget_module.dom.$field.on("blur", function (event) {
        // Remove class to hide search field and show other widgets
        qg_search_widget_module.dom.$parent.removeClass("search-form-widget--focused");
      }); // Because of how iOS handles blur (clicking on outside of the field doesn't blur a focused field)
      // We need this to simulate a focus blur when clicking elsewhere

      $(document).on("touchstart", function (event) {
        // Get this touched element
        var $this = $(event.target); // Check if element touched is not within the root

        if (qg_search_widget_module.dom.$field.is(":focus") && !$this.closest(qg_search_widget_module.dom.$root).length) {
          qg_search_widget_module.dom.$field.blur();
        }
      });
    }

    function setupToggleButton() {
      // Bind click event
      qg_search_widget_module.dom.$button_toggle.on("click", function (event) {
        qg_search_widget_module.dom.$parent.addClass("search-form-widget--focused");
        qg_search_widget_module.dom.$field.focus();
      });
    }

    function setupSubmitButton() {
      // Bind mousedown event 
      // Can't use click event. Has to capture event before blur event loses focus on the submit button
      qg_search_widget_module.dom.$button_submit.on("mousedown", function (event) {
        event.preventDefault();
        qg_search_widget_module.dom.$form.submit();
      });
    }

    function cacheElements() {
      // Get input search field element
      qg_search_widget_module.dom.$field = qg_search_widget_module.dom.$root.find(".qg-search-widget__field"); // Get form element

      qg_search_widget_module.dom.$form = qg_search_widget_module.dom.$root.find(".qg-search-widget__form"); // Get submit button element

      qg_search_widget_module.dom.$button_submit = qg_search_widget_module.dom.$root.find(".qg-search-widget__btn-submit"); // Get toggle button element

      qg_search_widget_module.dom.$button_toggle = qg_search_widget_module.dom.$root.find(".qg-search-widget__btn-toggle"); // Get parent element

      qg_search_widget_module.dom.$parent = qg_search_widget_module.dom.$root.parent();
    } // Initialisation


    function init() {
      qg_search_widget_module.dom = {}; // Get root node

      qg_search_widget_module.dom.$root = $(".qg-search-widget"); // If search widget exists

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
    };
  }(); // When dom is ready


  document.addEventListener("DOMContentLoaded", function () {
    // Initialise the module
    qg_search_widget_module.init();
  });
})();

/***/ }),
/* 15 */
/***/ (function(module, exports) {

(function () {
  'use strict';
  /*
   * =====================
   * Service Finder Module
   * =====================
   * The search finder module is a form which has an input search field and a submit button.
   *
   * -----------------------------------------
   * Functionality - FB Autocomplete Conceirge
   * -----------------------------------------
   * The Funnelback autocomplete coneirge is applied on the input search field to allow
   * - autocompletion
   * - organic suggestions (Up to 5)
   * - featured suggestion (1)
   * The script also clones the featured result into the organic result set for mobile view
   *
   * -------------------------------------------
   * Functionality - No results menu links focus
   * -------------------------------------------
   * We would prefer users are able to keyboard navigate through the no-menu links
   * Thus, a class needs to be added to the parent to keep the no-menu open when tabbing through
   *
   */

  var services_service_finder_module = function () {
    // Set up Funnelback Conceirge on input field
    function setupFBConceirge() {
      // Get autocomplete source url
      var autocomplete_source_url = services_service_finder.dom.$root.data("autocomplete-source"); // Create handlebars helper that will create the icons

      Handlebars.registerHelper('generateIconsMarkup', function (icons) {
        var icons_array = icons.split(" ");
        var icons_markup = "";
        icons_array.forEach(function (icon) {
          icons_markup += "<i class='fas " + icon + " services-service-finder__featured-icon' aria-hidden='true' title='" + icon + "'></i>";
        });
        return new Handlebars.SafeString(icons_markup);
      }); // Initiate conceirge plugin

      services_service_finder.dom.$field.autocompletion({
        program: autocomplete_source_url,
        scrollable: true,
        datasets: {
          organic: {
            name: 'General suggestions',
            collection: 'qgov-web',
            profile: 'services',
            show: 5
          },
          featured: {
            name: 'Featured result',
            collection: 'qld-gov',
            profile: 'featured_autoc',
            template: {
              'suggestion': '<div><h6 class="services-service-finder__featured-heading">{{label.title}}</h6>{{#if label.icon}}<div class="services-service-finder__featured-icons">{{generateIconsMarkup label.icon}}</div>{{/if}}<p class="services-service-finder__featured-description">{{label.description}}</p><button type="button" class="services-service-finder__featured-btn">{{label.CTA}}</button></div>'
            },
            show: 1
          }
        },
        length: 3,
        typeahead: {
          hint: true,
          events: {
            open: function open(event) {
              renderInputField();
            },
            close: function close(event) {
              renderInputField();
            },
            render: function render(event, suggestions, syncType, name) {
              renderInputField();
              cloneFeaturedResult();
            }
          }
        }
      }); // Cache dropdown result menu elements

      services_service_finder.dom.$tt_menu = services_service_finder.dom.$root.find(".tt-menu");
      services_service_finder.dom.$organic_results_wrapper = services_service_finder.dom.$tt_menu.find(".tt-dataset-organic");
      services_service_finder.dom.$featured_result_wrapper = services_service_finder.dom.$tt_menu.find(".tt-dataset-featured");
      services_service_finder.dom.$field.on('input', function () {
        renderInputField();
      }); // Unfocus on field when suggestion / featured result is clicked on

      $("body").on("click", ".tt-suggestion", function () {
        services_service_finder.dom.$field.blur();
      });
    } // Clone the featured result and insert into organic set so that featured result can appear between suggestions


    function cloneFeaturedResult() {
      // Remove featured result from organic result wrapper if exists
      services_service_finder.dom.$organic_results_wrapper.find(".tt-dataset-featured").remove();
      var $featured_result = services_service_finder.dom.$featured_result_wrapper.find(".tt-suggestion");

      if ($featured_result.length) {
        // Clone featured result set. Arguments are true in order to clone click events binded to search result
        var $featured_result_wrapper_clone = services_service_finder.dom.$featured_result_wrapper.clone(true, true); // Get number of organic results

        var $organic_results = services_service_finder.dom.$organic_results_wrapper.find(".tt-suggestion");

        if ($organic_results.length > 2) {
          $featured_result_wrapper_clone.insertAfter($organic_results.eq(1));
        } else {
          $featured_result_wrapper_clone.appendTo(services_service_finder.dom.$organic_results_wrapper);
        }
      }
    }

    function renderInputField() {
      // If results list menu has class and there are suggestions
      // Add classes to input field to adjust appearance
      // This will add a class if there are results and menu is open
      if (services_service_finder.dom.$tt_menu.hasClass("tt-open") && services_service_finder.dom.$tt_menu.find(".tt-suggestion").length) {
        services_service_finder.dom.$root.addClass("services-service-finder--results-shown");
      } else {
        services_service_finder.dom.$root.removeClass("services-service-finder--results-shown");
      } // This will add a class to specify there are featured results


      if (services_service_finder.dom.$featured_result_wrapper.find(".tt-suggestion").length) {
        services_service_finder.dom.$root.addClass("services-service-finder--has-featured-result");
      } else {
        services_service_finder.dom.$root.removeClass("services-service-finder--has-featured-result");
      }
    }

    function checkFieldHasInput(current_value) {
      if (current_value.length === 0) {
        services_service_finder.dom.$root.addClass("services-service-finder--no-input");
      } else {
        services_service_finder.dom.$root.removeClass("services-service-finder--no-input");
      }
    }

    function setupInputField() {
      // Add/removes "focus" class whenever the field is focused/blurred
      // This is to control CSS border radius of input and button
      // Also, if user is focused / blurred from field input, check if there is input
      // This is to make the "no results menu" hide if there is input
      // Focus event
      services_service_finder.dom.$field.on("focus", function (event) {
        var $this = $(event.target);
        var current_value = $this.val();
        checkFieldHasInput(current_value);
        services_service_finder.dom.$root.addClass("services-service-finder--focused");
      }); // Blur event

      services_service_finder.dom.$field.on("blur", function (event) {
        if ($('.services-service-finder--no-input').length <= 0) {
          var $this = $(event.target);
          var current_value = $this.val();
          checkFieldHasInput(current_value);
          services_service_finder.dom.$root.removeClass("services-service-finder--focused");
        }
      }); // Whenever user is typing or deleting input, check if there is input
      // This is to make the "no results menu" hide if there is input

      services_service_finder.dom.$field.on("input", function (event) {
        var $this = $(event.target);
        var current_value = $this.val();
        checkFieldHasInput(current_value);
      });
      $(document).click(function (event) {
        if ($(event.target).attr('class') !== 'services-service-finder__field tt-input') {
          services_service_finder.dom.$root.removeClass("services-service-finder--focused");
        }
      }); // Because of how iOS handles blur (clicking on outside of the field doesn't blur a focused field)
      // We need this to simulate a focus blur when clicking elsewhere

      $(document).on("touchstart", function (event) {
        // Get this touched element
        var $this = $(event.target); // Check if field was focused and element touched is not within the root

        if (services_service_finder.dom.$field.is(":focus") && !$this.closest(services_service_finder.dom.$root).length) {
          services_service_finder.dom.$field.blur();
        }
      });
    } // Whenever a link in the no results menu is selected, ensure that the no results menu is visible
    // This allows better keyboard navigation


    function setupNoResultsMenuLinks() {
      var no_result_menu_link_focused_state_class = "services-service-finder--no-results-menu-link-focused";
      services_service_finder.dom.$no_result_menu_links = services_service_finder.dom.$root.find(".services-service-finder__no-results-menu-list-item-link");
      services_service_finder.dom.$no_result_menu_container = services_service_finder.dom.$root.find(".services-service-finder__no-results-menu");
      services_service_finder.dom.$no_result_menu_links.on("focus", function (event) {
        services_service_finder.dom.$root.addClass(no_result_menu_link_focused_state_class);
      });
      services_service_finder.dom.$no_result_menu_links.on("focus", function (event) {
        services_service_finder.dom.$root.addClass(no_result_menu_link_focused_state_class);
      });
      services_service_finder.dom.$no_result_menu_container.on("click", function (event) {
        services_service_finder.dom.$root.removeClass("services-service-finder--focused");
      });
      services_service_finder.dom.$no_result_menu_links.on("blur", function (event) {
        services_service_finder.dom.$root.removeClass(no_result_menu_link_focused_state_class);
      });
    }

    function cacheElements() {
      // Get field input
      services_service_finder.dom.$field = services_service_finder.dom.$root.find(".services-service-finder__field");
    } // Initialisation


    function init() {
      services_service_finder.dom = {}; // Get root node

      services_service_finder.dom.$root = $(".services-service-finder"); // If sevice finder exists

      if (services_service_finder.dom.$root.length) {
        cacheElements(); // Set up the input field

        setupInputField(); // Initialise Funnelback Concerige

        setupFBConceirge(); // Set up no results menu links

        setupNoResultsMenuLinks();
      }
    }

    var services_service_finder = {};
    return {
      init: init
    };
  }();

  document.addEventListener("DOMContentLoaded", function () {
    services_service_finder_module.init();
  });
})();

/***/ }),
/* 16 */
/***/ (function(module, exports) {

(function () {
  'use strict';
  /*
  * ==========================
  * Weather Info Widget Module
  * ==========================
  * Deals with getting and displaying the current forecast depending on the user's coordinates.
  * 
  * When coordinates are received, the widget makes a call to the open weather API with the coordinates.
  * The response is in JSON.
  * The widget is then updated with the current forecast of the user's location and a related weather icon is shown
  * 
  * Note that this widget will fetch get and display the current forecast if the user's location is Queensland.
  * 
  */

  var qg_weather_info_widget_module = function () {
    // Update temperature from weather data
    function updateTemperature() {
      // Convert current temperature to 1 decimal place
      var current_temperature = parseFloat(weather_data.main.temp).toFixed(1); // Update widget with current temperature

      qg_weather_info_widget.dom.$temperature_wrapper.text(current_temperature);
    } // Update widget with related weather icon


    function updateIcon() {
      var prefix = 'wi wi-'; // Get code from weather data JSON

      var weather_data_code = weather_data.weather[0].id; // Get single char from icon string which tells us its day (d) or night (n)

      var weather_data_icon_char = weather_data.weather[0].icon.slice(-1); // Get mapped icon

      var mapped_icon = weather_icons_map[weather_data_code].icon; // If we are not in the ranges mentioned above, add a prefix.

      if (!(weather_data_code > 699 && weather_data_code < 800) && !(weather_data_code > 899 && weather_data_code < 1000)) {
        if (weather_data_icon_char === "d") {
          mapped_icon = 'day-' + mapped_icon;
        } else if (weather_data_icon_char === "n") {
          if (mapped_icon === "sunny") {
            mapped_icon = 'clear';
          }

          mapped_icon = 'night-' + mapped_icon;
        }
      } // Get description from weather data API


      var description = weather_data.weather[0].description; // Create icon element

      var $icon = $('<i/>', {
        "class": 'wi wi-' + mapped_icon,
        "title": description,
        "aria-hidden": "hidden"
      }); // Empty wrapper and append icon

      qg_weather_info_widget.dom.$image_wrapper.empty().append($icon);
    } // Get current forecast from open weather api


    function getCurrentForecast(lat, lon) {
      // Create request url to pass to Open Weather API
      var request_url = weather_data_source + "&lat=" + lat + "&lon=" + lon; // When the weather data is retrieved from open weather API by passing in the user's coords

      return $.getJSON(request_url);
    }

    function updateWidget(lat, lon) {
      // When successfully get a forecast from weather API
      $.when(getCurrentForecast(lat, lon)).done(function (data) {
        // If result is valid
        if (data.hasOwnProperty("weather")) {
          weather_data = data; // Update temperature

          updateTemperature(); // Update image icon

          updateIcon(); // Class to make the widget show is added to the root node

          qg_weather_info_widget.dom.$root.addClass("qg-weather-info-widget--has-result");
        }
      });
    } // Process the location to see if its Queensland


    function processLocation(location) {
      // Clear and reset widget
      resetWidget(); // If in Queensland

      if (location.state === "QLD") {
        updateWidget(location.lat, location.lon);
      }
    } // Reset the widget by clearing text, icon and hiding the widget


    function resetWidget() {
      // Empty temperature wrapper
      qg_weather_info_widget.dom.$temperature_wrapper.text(""); // Empty image wrapper

      qg_weather_info_widget.dom.$image_wrapper.empty(); // Class to make the widget show is added to the root node

      qg_weather_info_widget.dom.$root.removeClass("qg-weather-info-widget--has-result");
    }

    function subscribeToEvents() {
      // On "location set" event, get current forecast
      qg_user_location_module.event.on("location set", processLocation);
    }

    function cacheElements() {
      // Get wrapper which contains temperature text
      qg_weather_info_widget.dom.$temperature_wrapper = qg_weather_info_widget.dom.$root.find(".qg-weather-info-widget__temperature"); // Get wrapper which contains image

      qg_weather_info_widget.dom.$image_wrapper = qg_weather_info_widget.dom.$root.find(".qg-weather-info-widget__image");
    }

    function init() {
      qg_weather_info_widget.dom = {}; // Get root element

      qg_weather_info_widget.dom.$root = $(".qg-weather-info-widget"); // If widget exists

      if (qg_weather_info_widget.dom.$root.length) {
        subscribeToEvents();
        cacheElements(); // Get weather api data source url from root node

        weather_data_source = qg_weather_info_widget.dom.$root.data("weather-source");
      }
    }

    var qg_weather_info_widget = {};
    var weather_data_source;
    var weather_data; /// Mapping is from https://gist.github.com/tbranyen/62d974681dea8ee0caa1

    var weather_icons_map = {
      "200": {
        "label": "thunderstorm with light rain",
        "icon": "storm-showers"
      },
      "201": {
        "label": "thunderstorm with rain",
        "icon": "storm-showers"
      },
      "202": {
        "label": "thunderstorm with heavy rain",
        "icon": "storm-showers"
      },
      "210": {
        "label": "light thunderstorm",
        "icon": "storm-showers"
      },
      "211": {
        "label": "thunderstorm",
        "icon": "thunderstorm"
      },
      "212": {
        "label": "heavy thunderstorm",
        "icon": "thunderstorm"
      },
      "221": {
        "label": "ragged thunderstorm",
        "icon": "thunderstorm"
      },
      "230": {
        "label": "thunderstorm with light drizzle",
        "icon": "storm-showers"
      },
      "231": {
        "label": "thunderstorm with drizzle",
        "icon": "storm-showers"
      },
      "232": {
        "label": "thunderstorm with heavy drizzle",
        "icon": "storm-showers"
      },
      "300": {
        "label": "light intensity drizzle",
        "icon": "sprinkle"
      },
      "301": {
        "label": "drizzle",
        "icon": "sprinkle"
      },
      "302": {
        "label": "heavy intensity drizzle",
        "icon": "sprinkle"
      },
      "310": {
        "label": "light intensity drizzle rain",
        "icon": "sprinkle"
      },
      "311": {
        "label": "drizzle rain",
        "icon": "sprinkle"
      },
      "312": {
        "label": "heavy intensity drizzle rain",
        "icon": "sprinkle"
      },
      "313": {
        "label": "shower rain and drizzle",
        "icon": "sprinkle"
      },
      "314": {
        "label": "heavy shower rain and drizzle",
        "icon": "sprinkle"
      },
      "321": {
        "label": "shower drizzle",
        "icon": "sprinkle"
      },
      "500": {
        "label": "light rain",
        "icon": "rain"
      },
      "501": {
        "label": "moderate rain",
        "icon": "rain"
      },
      "502": {
        "label": "heavy intensity rain",
        "icon": "rain"
      },
      "503": {
        "label": "very heavy rain",
        "icon": "rain"
      },
      "504": {
        "label": "extreme rain",
        "icon": "rain"
      },
      "511": {
        "label": "freezing rain",
        "icon": "rain-mix"
      },
      "520": {
        "label": "light intensity shower rain",
        "icon": "showers"
      },
      "521": {
        "label": "shower rain",
        "icon": "showers"
      },
      "522": {
        "label": "heavy intensity shower rain",
        "icon": "showers"
      },
      "531": {
        "label": "ragged shower rain",
        "icon": "showers"
      },
      "600": {
        "label": "light snow",
        "icon": "snow"
      },
      "601": {
        "label": "snow",
        "icon": "snow"
      },
      "602": {
        "label": "heavy snow",
        "icon": "snow"
      },
      "611": {
        "label": "sleet",
        "icon": "sleet"
      },
      "612": {
        "label": "shower sleet",
        "icon": "sleet"
      },
      "615": {
        "label": "light rain and snow",
        "icon": "rain-mix"
      },
      "616": {
        "label": "rain and snow",
        "icon": "rain-mix"
      },
      "620": {
        "label": "light shower snow",
        "icon": "rain-mix"
      },
      "621": {
        "label": "shower snow",
        "icon": "rain-mix"
      },
      "622": {
        "label": "heavy shower snow",
        "icon": "rain-mix"
      },
      "701": {
        "label": "mist",
        "icon": "sprinkle"
      },
      "711": {
        "label": "smoke",
        "icon": "smoke"
      },
      "721": {
        "label": "haze",
        "icon": "day-haze"
      },
      "731": {
        "label": "sand, dust whirls",
        "icon": "cloudy-gusts"
      },
      "741": {
        "label": "fog",
        "icon": "fog"
      },
      "751": {
        "label": "sand",
        "icon": "cloudy-gusts"
      },
      "761": {
        "label": "dust",
        "icon": "dust"
      },
      "762": {
        "label": "volcanic ash",
        "icon": "smog"
      },
      "771": {
        "label": "squalls",
        "icon": "day-windy"
      },
      "781": {
        "label": "tornado",
        "icon": "tornado"
      },
      "800": {
        "label": "clear sky",
        "icon": "sunny"
      },
      "801": {
        "label": "few clouds",
        "icon": "cloudy"
      },
      "802": {
        "label": "scattered clouds",
        "icon": "cloudy"
      },
      "803": {
        "label": "broken clouds",
        "icon": "cloudy"
      },
      "804": {
        "label": "overcast clouds",
        "icon": "cloudy"
      },
      "900": {
        "label": "tornado",
        "icon": "tornado"
      },
      "901": {
        "label": "tropical storm",
        "icon": "hurricane"
      },
      "902": {
        "label": "hurricane",
        "icon": "hurricane"
      },
      "903": {
        "label": "cold",
        "icon": "snowflake-cold"
      },
      "904": {
        "label": "hot",
        "icon": "hot"
      },
      "905": {
        "label": "windy",
        "icon": "windy"
      },
      "906": {
        "label": "hail",
        "icon": "hail"
      },
      "951": {
        "label": "calm",
        "icon": "sunny"
      },
      "952": {
        "label": "light breeze",
        "icon": "cloudy-gusts"
      },
      "953": {
        "label": "gentle breeze",
        "icon": "cloudy-gusts"
      },
      "954": {
        "label": "moderate breeze",
        "icon": "cloudy-gusts"
      },
      "955": {
        "label": "fresh breeze",
        "icon": "cloudy-gusts"
      },
      "956": {
        "label": "strong breeze",
        "icon": "cloudy-gusts"
      },
      "957": {
        "label": "high wind, near gale",
        "icon": "cloudy-gusts"
      },
      "958": {
        "label": "gale",
        "icon": "cloudy-gusts"
      },
      "959": {
        "label": "severe gale",
        "icon": "cloudy-gusts"
      },
      "960": {
        "label": "storm",
        "icon": "thunderstorm"
      },
      "961": {
        "label": "violent storm",
        "icon": "thunderstorm"
      },
      "962": {
        "label": "hurricane",
        "icon": "cloudy-gusts"
      } // Initialise this module only when the user location module is initiliased

    };
    qg_user_location_module.event.on("user location module initialised", init);
  }();
})();

/***/ })
],[[0,1]]]);