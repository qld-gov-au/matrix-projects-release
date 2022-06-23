export const isDevelopment = () => {
    return process && process.env && (process.env.NODE_ENV === 'development');
};

export const sendXHR = function(xhr_parameters, method) {
    var xhr = new XMLHttpRequest();
    var request_url = xhr_parameters['request_url'];
    var request_extras = xhr_parameters['request_extras'];
    var request_success = xhr_parameters['request_success'];
    var request_failure = xhr_parameters['request_failure'];

    // Handle timeouts in modern browsers
    xhr.ontimeout = function () {
        console.log("FAIL - HTTP request for '" + request_url + "' timed out.");
    };

    // Handle aborted connections
    xhr.onabort = function () {
        console.log("FAIL - HTTP request for '" + request_url + "' was aborted.");
    };

    // Handle when XHR has processed
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            switch(this.status) {
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

    switch(method) {
        case 'GET':
            xhr.send();
            break;
        case 'POST':
            // This is the request payload
            xhr.send(request_extras);
            break;
    }
}

export const failedRequest = function() {
    console.log('The request failed.');
}

export const findLink = function(event) {
    var target = event['target'];
    var tag_type = target['tagName'].toLowerCase();
    var found_link = false;

    if(tag_type === 'a'){
        found_link = true;
    }

    // Cater for clicking on child elements of the anchor
    while(!found_link){
        target = target['parentNode'];
        tag_type = target['tagName'].toLowerCase();

        if(tag_type === 'a') {
            found_link = true;
        }
    }

    return target;
}

export const generateLoader = function() {
    var loader = '<div class="d-flex justify-content-center">';
    loader += '<div class="spinner-border text-primary" role="status">';
    loader += '<span class="sr-only">Loading...</span>';
    loader += '</div>';
    loader += '</div>';
    
    return loader;
};
