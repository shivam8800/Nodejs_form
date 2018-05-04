$(document).ready(function () {


    $("#signup_form").validate();

    $('#submit').click(function (e) {

        var userModel = $('#signup_form').serializeArray().reduce(function (obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});

        if (!$("#signup_form").valid()) {
            alert("Please correct the indicated fields")
            return
        }



        if ($("#toggle-action").data('form-state') == 'signup') {
            send_signup_request(userModel)
        } else
            send_login_request(userModel['email'], userModel['otp'])



    });


    let send_signup_request = (userModel) => {


        // Overlay the loader
        $('body').loading({
            onStart: function (loading) {
                loading.overlay.slideDown(400);
            },
            onStop: function (loading) {
                loading.overlay.slideUp(400);
            },
            message: "Working ..."
        });

        $.ajax({
            url: "api/vendor/signup",
            type: "POST",
            data: userModel,
            success: function (response) {

                $('body').loading('stop')
                if (response.statusCode == 503) {
                    switch (response.message.code) {
                        case 11000:
                            swal("Wait a second", "Looks like you already have an account. Try signing in", "error");
                            break;
                    }
                    return
                }
                swal("Success!", "You are signed up. Enter the OTP received on email below.", "success");
                show_login_state()


                // window.localStorage.setItem('objectid', json['data']['_id']);
                // window.localStorage.setItem('email', $('#email').val());
                // window.location = "/otp" + json["data"]['_id']
                
            },
            error: function (err) {
                $('body').loading('stop')
                alert(err);
            }
        });
    }

    let send_login_request = (email, otp) => {


        // Overlay the loader
        $('body').loading({
            onStart: function (loading) {
                loading.overlay.slideDown(400);
            },
            onStop: function (loading) {
                loading.overlay.slideUp(400);
            },
            message: "Working ..."
        });


        // If otp field is not visible in UI, send the person an OTP
        // and reveal OTP field
        if ($("#otp").hasClass('hide')) {

            $.ajax({
                url: `/api/vendor/generateotp/${email}`,
                type: "GET",
                success: function (response) {

                    $('body').loading('stop')
                    if (response.statusCode == 503) {
                        swal("Sorry about this", "There was a problem sending OTP to your email. Contact vineet@birchapp.io", "error");
                        return
                    }

                    swal("You are all set", "If you are signed up with Birch, we just sent the OTP over email to you", "success");


                    // Show OTP input box
                    $("#otp").slideDown().removeClass('hide')
                    $("#submit").text("Login")


                },
                error: function (err) {
                    $('body').loading('stop')
                    swal("Sorry about this", "There was a problem sending OTP to your email. Contact vineet@birchapp.io", "error");
                }
            });

        } else {
            // Ask him to enter an OTP and login
            submit_form(`/api/vendor/auth`,{ email: email, otp: otp })
        }



    }

    let show_login_state = () => {

        $(".phonedetails").addClass('hide')
        $("#otp").slideDown().removeClass('hide')
        $("#submit").text("Login")
        $("#name").addClass('hide')       
        $("#toggle-action").text('Create an account')

        $("#toggle-action").data('form-state', 'login')

    }

    $("#toggle-action").click(() => {

        if ($("#toggle-action").data('form-state') == 'signup') {
            $(".phonedetails").addClass('hide')
            $("#submit").text("Send OTP")
            $("#name").addClass('hide')
            $("#otp").addClass('hide')
            $("#toggle-action").text('Create an account')

            $("#toggle-action").data('form-state', 'login')
        } else {
            $(".phonedetails").removeClass('hide')
            $("#submit").text("Sign up")
            $("#name").removeClass('hide')
            $("#toggle-action").text('Have an account?')

            $("#toggle-action").data('form-state', 'signup')
        }
    });
});
