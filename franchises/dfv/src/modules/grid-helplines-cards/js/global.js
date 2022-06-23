// Imports
import { isDevelopment } from "../../../lib/utils";

(function(){
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {

        if(isDevelopment()) {
            salvattore.rescanMediaQueries();
        }

    });

}());
