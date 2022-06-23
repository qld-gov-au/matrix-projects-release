(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return isDevelopment; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return sendXHR; });
/* unused harmony export failedRequest */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return findLink; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return generateLoader; });
var isDevelopment = function isDevelopment() {
  return process && process.env && "production" === 'development';
};
var sendXHR = function sendXHR(xhr_parameters, method) {
  var xhr = new XMLHttpRequest();
  var request_url = xhr_parameters['request_url'];
  var request_extras = xhr_parameters['request_extras'];
  var request_success = xhr_parameters['request_success'];
  var request_failure = xhr_parameters['request_failure']; // Handle timeouts in modern browsers

  xhr.ontimeout = function () {
    console.log("FAIL - HTTP request for '" + request_url + "' timed out.");
  }; // Handle aborted connections


  xhr.onabort = function () {
    console.log("FAIL - HTTP request for '" + request_url + "' was aborted.");
  }; // Handle when XHR has processed


  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      switch (this.status) {
        case 200:
        case 201:
        case 204:
          request_success(this.responseText, request_extras);
          break;

        default:
          request_failure(this);
          break;
      }
    }
  };

  xhr.open(method, request_url, true);
  xhr.timeout = 120000;
  xhr.withCredentials = true;

  switch (method) {
    case 'GET':
      xhr.send();
      break;

    case 'POST':
      // This is the request payload
      xhr.send(request_extras);
      break;
  }
};
var failedRequest = function failedRequest() {
  console.log('The request failed.');
};
var findLink = function findLink(event) {
  var target = event['target'];
  var tag_type = target['tagName'].toLowerCase();
  var found_link = false;

  if (tag_type === 'a') {
    found_link = true;
  } // Cater for clicking on child elements of the anchor


  while (!found_link) {
    target = target['parentNode'];
    tag_type = target['tagName'].toLowerCase();

    if (tag_type === 'a') {
      found_link = true;
    }
  }

  return target;
};
var generateLoader = function generateLoader() {
  var loader = '<div class="d-flex justify-content-center">';
  loader += '<div class="spinner-border text-primary" role="status">';
  loader += '<span class="sr-only">Loading...</span>';
  loader += '</div>';
  loader += '</div>';
  return loader;
};
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(8)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(9);
__webpack_require__(10);
module.exports = __webpack_require__(11);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_global_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _styles_global_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_global_scss__WEBPACK_IMPORTED_MODULE_0__);
// CSS


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports) {

(function () {
  'use strict';
  /*
      Global namespace
  */

  var qg_dfv = {
    'fn': {},
    'vars': {}
  }; // Make variable available to the console for debugging

  window.qg_dfv = qg_dfv;
})();

/***/ }),
/* 5 */
/***/ (function(module, exports) {

(function () {
  'use strict';

  var franchise_breadcrumb_ellipses_module = function () {
    // When the breadcrumb ellipses is clicked
    function breadcrumbEllipsesClicked(event) {
      event.preventDefault(); // Remove breadcrumb ellipses from DOM

      $breadcrumb_ellipses.remove();
    }

    function init() {
      // Get franchise list item in the breadcrumbs (identified by a data attribute)
      var $franchise_list_item = $("li[data-franchise-page]"); // If franchise list item exists

      if ($franchise_list_item.length) {
        // Get all siblings after the franchise item
        var $franchise_list_item_next_siblings = $franchise_list_item.nextAll(); // If there is more than 1 sibling

        if ($franchise_list_item_next_siblings.length > 1) {
          // Prepare the breadcrumb ellipses DOM element
          var ellipses_markup = '<li class="qg-breadcrumb__ellipses">';
          ellipses_markup += '<a href="#" role="button" aria-pressed="false" aria-label="Reveal hidden breadcrumbs" data-analytics-link-group="dfv-breadcrumbs">';
          ellipses_markup += '...';
          ellipses_markup += '</a>';
          ellipses_markup += '</li>';
          $breadcrumb_ellipses = $(ellipses_markup); // Insert it after the franchise breacrumb item and attach a click handler

          $breadcrumb_ellipses.insertAfter($franchise_list_item).click(breadcrumbEllipsesClicked);
        }
      }
    }

    var $breadcrumb_ellipses; // To store a prepared DOM element to insert after the franchise list item

    return {
      init: init
    };
  }(); // Initiate module


  document.addEventListener("DOMContentLoaded", function () {
    franchise_breadcrumb_ellipses_module.init();
  });
})();

/***/ }),
/* 6 */
/***/ (function(module, exports) {

(function () {
  'use strict';
  /*
      Functions
  */
  // Build in-page navigation

  qg_dfv.fn.initContentNavigation = function () {
    var table_of_contents = $('.qg-content-navigation__wrapper');
    var heading_list = table_of_contents.find('.qg-content-navigation__list');
    var content_page = table_of_contents.parent();
    var heading_depth = table_of_contents.attr('data-depth');
    var all_headings = ['h2', 'h3', 'h4', 'h5', 'h6'];
    var heading_items = []; // Figure out which headings to list

    var depth_limit = all_headings.indexOf(heading_depth) + 1; // Take a sample of headings up to chosen limit

    var allowed_headings = all_headings.slice(0, depth_limit); // Loop through chosen heading levels

    $(allowed_headings).each(function (level_index, level) {
      // Find this heading in the content
      $(content_page).find(level).each(function (heading_index, heading) {
        var heading_title = $(heading).text();
        var heading_link = '#' + $(heading).attr('id'); // Don't include the h2 in the navigation panel

        if (!$(heading).parent().hasClass('qg-content-navigation')) {
          // Create the navigation item
          var list_item = '<li class="qg-content-navigation__item">';
          list_item += '<a href="' + heading_link + '" class="qg-content-navigation__link" data-analytics-link-group="dfv-inpagenavigation">';
          list_item += '<span class="qg-content-navigation__prompt"></span>';
          list_item += '<span class="qg-content-navigation__title">' + heading_title + '</span>';
          list_item += '</a>';
          list_item += '</li>'; // Add to master list

          heading_items.push(list_item);
        }
      });
    }); // Append headings to navigation list

    heading_list.html(heading_items.join(''));
  };
  /*
      Ready
  */


  $(document).ready(function () {
    // Only call this function when the template is included
    if ($('.qg-content-navigation__wrapper').length > 0) {
      // Build in-page navigation
      qg_dfv.fn.initContentNavigation();
    }
  });
})();

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
// Imports


(function () {
  'use strict';
  /*
      Events
  */
  // Clear filters

  qg_dfv.fn.clearFilters = function (event) {
    var page_number = 1; // Reset filters to show placeholders

    $('.qg-search-filter__wrapper .filter__item').each(function (item_index, item) {
      $(item).find('select').val('All').trigger('change');
    }); // Get all results

    qg_dfv.fn.getFilteredResults(page_number);
  }; // Get results with filters applied


  qg_dfv.fn.handleSearchSubmit = function (event) {
    var page_number = 1; // Set all empty selects to default to All

    $('.qg-search-filter__wrapper .filter__item select').each(function (item_index, item) {
      if ($(item).val() === '') {
        $(item).val('All').trigger('change');
      }
    }); // Get results

    qg_dfv.fn.getFilteredResults(page_number);
    return false;
  }; // Get a results page based on paginated link


  qg_dfv.fn.handleSearchPaginationClick = function (event) {
    var target_link = Object(_lib_utils__WEBPACK_IMPORTED_MODULE_0__[/* findLink */ "a"])(event);
    var page_number; // Handle previous / next

    if ($(target_link).hasClass('qg-previous')) {
      // Previous 
      page_number = parseInt(target_link.getAttribute('data-current'));
    } else if ($(target_link).hasClass('qg-next')) {
      // Next
      page_number = parseInt(target_link.getAttribute('data-current')) + 2;
    } else {
      // Standard
      page_number = target_link.getAttribute('data-page');
    } // Get results


    qg_dfv.fn.getFilteredResults(page_number);
    return false;
  };
  /*qg_dfv.fn.checkForConditionalEvents = function(target_input) {
      var input_id = target_input.attr('id');
      var input_structure = input_id.split('--');
      var filter_namespace = input_structure[0];
      var filter_id = input_structure[1];
       var region_input = $('#' + filter_namespace + '--region');
      var suburb_input = $('#' + filter_namespace + '--suburb');
       var current_region = region_input.val();
      var current_suburb = suburb_input.val();
       // Look for empty / All
      var empty_values = ['', 'All'];
      var region_index = empty_values.indexOf(current_region);
      var suburb_index = empty_values.indexOf(current_suburb);
       // Reset other filters based on new values
      switch(filter_id) {
          case 'suburb':
              if(suburb_index === -1) {
                  if(region_index < 1) {
                      region_input.val('All').trigger('change');
                  }
              }
              
              break;
          case 'region':
              if(region_index === -1) {
                  if(suburb_index < 1) {
                      suburb_input.val('All').trigger('change');
                  }
              }
               break;
      }
  };*/

  /*
      Functions
  */
  // Initialise Select2 plugin for filters


  qg_dfv.fn.initFilterSelects = function () {
    $('.qg-search-filter__wrapper .filter__item').each(function (item_index, item) {
      var placeholder = $(item).find('label').text();
      var select_inputs = $(item).find('select');
      select_inputs.select2({
        'minimumResultsForSearch': Infinity,
        'placeholder': placeholder,
        'width': '100%'
      });
      /*select_inputs.on('select2:open', function(e) {
          $('.select2-search input').prop('focus',false);
      });*/

      /*select_inputs.on('change', function(event) {
          var target_input = $(event.target);
          qg_dfv.fn.checkForConditionalEvents(target_input);
      });*/
    });
  }; // Get results with filters applied


  qg_dfv.fn.getFilteredResults = function (page_number) {
    var rest_config = $('#display-filter-data__config');
    var results_url = rest_config.attr('data-rest');
    var results_container = $('.qg-rest__wrapper'); // Add onto the request URL

    results_url += '?template_type=results';
    results_url += '&data_listing=' + rest_config.attr('data-root');
    results_url += '&template_source=' + rest_config.attr('data-template');
    results_url += '&results_per_page=' + rest_config.attr('data-per-page');
    results_url += '&result_pages=' + rest_config.attr('data-pages');
    results_url += '&page=' + page_number; // Add filters

    $('.qg-search-filter__wrapper .filter__item').each(function (item_index, item) {
      var filter_name = $(item).attr('data-filter');
      var filter_value = $(item).find('select').val();
      results_url += '&' + filter_name + '=' + filter_value;
    }); // Prepare XHR request

    var xhr_parameters = {
      'request_url': results_url,
      'request_extras': '',
      'request_success': qg_dfv.fn.loadFilteredResults,
      'request_failure': qg_dfv.fn.failedRequest
    }; // Prepare loading visual cue

    var loader = Object(_lib_utils__WEBPACK_IMPORTED_MODULE_0__[/* generateLoader */ "b"])(); // Scroll up to top of results

    qg_dfv.fn.scrollToResults(results_container);

    if (Object(_lib_utils__WEBPACK_IMPORTED_MODULE_0__[/* isDevelopment */ "c"])()) {
      /* Local */
      var all_content = results_container.html();
      results_container.html(loader); // Emulate loading results for local development version

      setTimeout(function () {
        qg_dfv.fn.loadFilteredResults(all_content);
      }, 5000);
    } else {
      /* Production */
      // Add loading visual cue and fetch results
      setTimeout(function () {
        results_container.html(loader);
        Object(_lib_utils__WEBPACK_IMPORTED_MODULE_0__[/* sendXHR */ "d"])(xhr_parameters, 'GET');
      }, 1000);
    }

    return false;
  }; // Load results


  qg_dfv.fn.loadFilteredResults = function (response) {
    var results_container = $('.qg-rest__wrapper');
    var default_title = 'All support services';
    var results_title = 'Support services for ';
    var selected_values = []; // Display results

    results_container.html(response); // Determine current filters to use in results title

    $('.qg-search-filter__wrapper .filter__item').each(function (item_index, item) {
      var filter_value = $(item).find('select').val();

      if (filter_value !== '' && filter_value !== 'All') {
        selected_values.push(filter_value);
      }
    }); // Update results title

    if (selected_values.length === 0) {
      results_title = default_title;
    } else {
      results_title += selected_values.join(', ');
    }

    $('.qg-search-results__wrapper h2').text(results_title); // Analytics

    qg_dfv.fn.sendAnalytics();

    if (!Object(_lib_utils__WEBPACK_IMPORTED_MODULE_0__[/* isDevelopment */ "c"])()) {
      // Invoke Salvattore for masonry layout
      var grid = document.querySelector('.qg-search-results__list');
      salvattore.registerGrid(grid);
    }
  }; // Scroll to results area


  qg_dfv.fn.scrollToResults = function (results_container) {
    var scroll_to = results_container.position();
    $('html, body').animate({
      scrollTop: scroll_to['top']
    }, 1000);
  }; // Analytics


  qg_dfv.fn.sendAnalytics = function () {
    var result_count = $('.qg-search-results__wrapper').attr('data-results-count');
    var all_filters = $('.filter__item');
    var filters_applied = [];
    all_filters.each(function (filter_index, filter) {
      var label = $(filter).attr('data-filter-label');
      label = label.charAt(0).toUpperCase() + label.slice(1) + ': '; // Add the value if it exists

      label += $(filter).find('select').val();
      filters_applied.push(label);
    }); // Prepare report

    var analytics_data = {
      'event': 'ajaxFormResults',
      'resultCount': result_count,
      'filtersApplied': filters_applied.join(' | ')
    }; // Send to GA

    var dataLayer = window.dataLayer || [];
    dataLayer.push(analytics_data);
  };
  /*
      Ready
  */


  $(document).ready(function () {
    qg_dfv.fn.initFilterSelects();

    if (Object(_lib_utils__WEBPACK_IMPORTED_MODULE_0__[/* isDevelopment */ "c"])()) {
      // Refresh grid for viewpoint change, as JS runs before styles are injected
      console.log('rescanMediaQueries');
      salvattore.rescanMediaQueries();
    } // Binds


    $('body').on('click', '.qg-search-filter__wrapper button[type="submit"]', qg_dfv.fn.handleSearchSubmit);
    $('body').on('click', '.qg-search-filter__wrapper button[type="reset"]', qg_dfv.fn.clearFilters);
    $('body').on('click', '.qg-search-results__pagination a.page-link', qg_dfv.fn.handleSearchPaginationClick);
  });
})();

/***/ }),
/* 8 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 9 */
/***/ (function(module, exports) {

(function () {
  'use strict';
})();

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _lib_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(0);
// Imports


(function () {
  'use strict';

  document.addEventListener("DOMContentLoaded", function () {
    if (Object(_lib_utils__WEBPACK_IMPORTED_MODULE_0__[/* isDevelopment */ "c"])()) {
      salvattore.rescanMediaQueries();
    }
  });
})();

/***/ }),
/* 11 */
/***/ (function(module, exports) {

(function () {
  'use strict';
  /*
      Events
  */

  $(document).keydown(function (event) {
    // ESC key pressed
    if (event.keyCode === 27) {
      // Simulate a click to prevent popup blocks
      try {
        new MouseEvent('test');
        $('.qg-quick-exit__button').trigger('click');
      } catch (e) {
        // MouseEvent not supported in IE
        qg_dfv.fn.exitWindow();
      }
    }
  });
  /*
      Functions
  */
  // Replace current window with new resource

  qg_dfv.fn.exitWindow = function () {
    var new_location = 'https://www.google.com.au';
    window.open(new_location, '_blank', ''); // Timeout to help browser do multiple actions

    setTimeout(function () {
      return window.location.replace(new_location), !1;
    }, 10);
  }; // Hide tooltip when clicking on the body


  $(document).mouseup(function (event) {
    var target = event.target;
    var input_selector = '#qg-quick-exit__input';
    var input_container = $(target).parents('.qg-quick-exit__item'); // Look for input / label clicking

    if (input_container.length > 0) {
      if (input_container.find(input_selector).length === 0) {
        // Click is not on the input or label. Force close the tooltip
        $(input_selector).prop('checked', false);
      }
    } else {
      // Click is not on the input or label. Force close the tooltip
      $(input_selector).prop('checked', false);
    }
  });
  /*
      Ready
  */

  $(document).ready(function () {
    // IE 11 polyfill
    var sticky_elements = $('.qg-quick-exit__wrapper');
    Stickyfill.add(sticky_elements); // Binds

    $('body').on('click', '.qg-quick-exit__button', qg_dfv.fn.exitWindow);
  });
})();

/***/ })
],[[1,1]]]);