(function(){
    'use strict';
    

    /*
        Functions
    */
    
    // Build in-page navigation
    qg_dfv.fn.initContentNavigation = function() {
        var table_of_contents = $('.qg-content-navigation__wrapper');
        var heading_list = table_of_contents.find('.qg-content-navigation__list');
        var content_page = table_of_contents.parent();
        var heading_depth = table_of_contents.attr('data-depth');
        var all_headings = ['h2', 'h3', 'h4', 'h5', 'h6'];
        var heading_items = [];

        // Figure out which headings to list
        var depth_limit = all_headings.indexOf(heading_depth) + 1;

        // Take a sample of headings up to chosen limit
        var allowed_headings = all_headings.slice(0, depth_limit);

        // Loop through chosen heading levels
        $(allowed_headings).each(function(level_index, level) {

            // Find this heading in the content
            $(content_page).find(level).each(function(heading_index, heading) {
                var heading_title = $(heading).text();
                var heading_link = '#' + $(heading).attr('id');

                // Don't include the h2 in the navigation panel
                if(!$(heading).parent().hasClass('qg-content-navigation')) {

                    // Create the navigation item
                    var list_item = '<li class="qg-content-navigation__item">';
                    list_item += '<a href="' + heading_link + '" class="qg-content-navigation__link" data-analytics-link-group="dfv-inpagenavigation">';
                    list_item += '<span class="qg-content-navigation__prompt"></span>';
                    list_item += '<span class="qg-content-navigation__title">' + heading_title + '</span>';
                    list_item += '</a>';
                    list_item += '</li>';

                    // Add to master list
                    heading_items.push(list_item);
                }
            });
        });

        // Append headings to navigation list
        heading_list.html(heading_items.join(''));
    };


    /*
        Ready
    */
    
    $(document).ready(function() {

        // Only call this function when the template is included
        if($('.qg-content-navigation__wrapper').length > 0) {

            // Build in-page navigation
            qg_dfv.fn.initContentNavigation();
        }

    });

}());
