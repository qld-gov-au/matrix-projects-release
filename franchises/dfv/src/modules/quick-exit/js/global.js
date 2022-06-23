(function(){
    'use strict';


    /*
        Events
    */

    $(document).keydown(function(event){
        // ESC key pressed
        if(event.keyCode === 27) {
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
    qg_dfv.fn.exitWindow = function() {
        var new_location = 'https://www.google.com.au';
        window.open(new_location, '_blank', '');

        // Timeout to help browser do multiple actions
        setTimeout(function(){
            return window.location.replace(new_location),!1
        }, 10);
    }

    // Hide tooltip when clicking on the body
    $(document).mouseup(function (event) {
        var target = event.target;
        var input_selector = '#qg-quick-exit__input';
        var input_container = $(target).parents('.qg-quick-exit__item');

        // Look for input / label clicking
        if(input_container.length > 0) {
            if(input_container.find(input_selector).length === 0) {
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
    
    $(document).ready(function() {

        // IE 11 polyfill
        var sticky_elements = $('.qg-quick-exit__wrapper');
        Stickyfill.add(sticky_elements);

        // Binds
        $('body').on('click', '.qg-quick-exit__button', qg_dfv.fn.exitWindow);
    });
}());
