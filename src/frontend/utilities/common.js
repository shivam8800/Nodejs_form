$(document).ready(function () {

    $.ajaxSetup({
        contentType: "application/json",
        dataType: "json"
    })


    // Validateor set up
    $.validator.setDefaults({
        // debug:true,
        errorPlacement: function (error, element) {
            error.appendTo(element.parent())
        }
    })

    // Check essential fields on user object for talents screen
    window.talents_are_complete = (user) => {
        if(user.talents.length)
            return true
        else
            return false
    }

    // Creates a form dynamically and submits it to th server. 
    // We can use this when we don't intend to make an AJAX/XHR call
    window.submit_form = function (path, params, method) {
        method = method || "post"; // Set method to post by default if not specified.

        // The rest of this code assumes you are not using a library.
        // It can be made less wordy if you use one.
        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
            }
        }

        document.body.appendChild(form);
        form.submit();
    }


    // B is a alternative to $.ajax. JQuery does not return proper ES6 promises  which are required for 
    // async and await to work properly. So we are wrapping up ajax calls into our own custom functions
    window.B = {}

    B.get = (url, data) => {

        return new Promise((resolve, reject) => {
            $.get(url, data).done(d => { resolve(d) }).fail(e => { reject(e) })
        })

    }


    B.post = (url, data) => {

        return new Promise((resolve, reject) => {
            $.post(url, data).done(d => { resolve(d) }).fail(e => { reject(e) })
        })

    }
})

