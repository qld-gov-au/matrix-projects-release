(function(){
    
    'use strict';
    
    /*
     * =================================
     * Contact Landing Page Form Module
     * =================================
     * 
     * Depending on what radio the user selects on the contact landing page form, the user could either
     * - be redirected to a different URL or
     * - see an alert
     * 
     */

    var qg_open_data_contact_lp_form_module = (function() {
    
        function setupSubmission() {
            
            // On form submit
            contact_lp_form.dom.$root.on("submit", function(event) {
               
                // Prevent default submission action
                event.preventDefault(); 
                
                // Get checked input
                var $checked_radio = contact_lp_form.dom.$radios.filter(":checked");
                
                // Get submit action from data attribute
                var checked_radio_submit_action = $checked_radio.data("action");
                
                // If action is redirect
                if (checked_radio_submit_action === "redirect") {
                    
                    // Get redirect url
                    var redirect_url = $checked_radio.data("redirect-url");
                    
                    // If valid string
                    if (redirect_url.length) {
                        
                        // Redirect user
                        window.location.href = redirect_url;
                        
                    }
                    
                }
                
            });
            
        }
        
        function setupRadios() {
            
            // On change of radio selection
            contact_lp_form.dom.$radios.on("change", function(event) {
                
                // Get checked radio
                var $this = $(event.target);
               
                // Hide all alerts
                contact_lp_form.dom.$alerts.addClass("hidden");
                
                // Get action
                var checked_radio_submit_action = $this.data("action"); 
                        
                if (checked_radio_submit_action === "alert") {
                    
                    var alert_target = $this.data("alert-target");
                    
                    if (alert_target.length) {
                        
                        $(alert_target).removeClass("hidden");
                        
                        contact_lp_form.dom.$submit_btn.prop("disabled",true).addClass("hidden");
                        
                    }
                    
                    
                } else {
                    
                    contact_lp_form.dom.$submit_btn.prop("disabled", false).removeClass("hidden");
                    
                }
                
            });
            
        }

        function cacheElements() {
            
            // Get radio inputs
            contact_lp_form.dom.$radios = contact_lp_form.dom.$root.find("[type='radio']");
            
            // Get submit button
            contact_lp_form.dom.$submit_btn = contact_lp_form.dom.$root.find("[type='submit']");

            // Get alerts
            contact_lp_form.dom.$alerts = contact_lp_form.dom.$root.find(".alert");

        }
        
        // Initialise module
        function init() {
            
            contact_lp_form.dom = {};

            // Get root node
            contact_lp_form.dom.$root = $("#contact-landing-page-form");
            
            // If root node exists
            if (contact_lp_form.dom.$root.length) {

                cacheElements();

                setupRadios();
                
                setupSubmission();

            }
            
        }
        
        var contact_lp_form = {};
        
        return {
            init: init
        }
        
    }());
    
    document.addEventListener("DOMContentLoaded", function() {
        qg_open_data_contact_lp_form_module.init();
    });
    
}());

    

