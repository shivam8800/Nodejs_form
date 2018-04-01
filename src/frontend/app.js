$(document).ready(function(){

    $("#order_form").validate();
    var counter = 0
    $('#total_budget').on('input', function() {

        if ( $('#total_videos').val() != "" && $('#video_length').val() != ""  && $('#total_budget').val() != ""){
            counter = counter + 1;
            var totalMinutes = $('#total_videos').val() * $('#video_length').val()
            var totalBudget = $('#total_budget').val();

            var oneMinuteCost = totalBudget/totalMinutes

            if (counter > 0){
                $('#message').children("small").remove();
            }

            $("#message").append("<small style='color: blue;'>You are spending " +  Math.round(oneMinuteCost) + " $ each minute</small>");
        } else if ($('#total_videos').val() == "" || $('#video_length').val() == ""  || $('#total_budget').val() == " "){
            $('#message').children("small").remove();
        }
    });

    var counter1 = 0
    $('#total_videos').on('input', function() {

        if ( $('#total_videos').val() != "" && $('#video_length').val() != ""  && $('#total_budget').val() != ""){
            counter1 = counter1 + 1;
            var totalMinutes = $('#total_videos').val() * $('#video_length').val()
            var totalBudget = $('#total_budget').val();

            var oneMinuteCost = totalBudget/totalMinutes

            if (counter1 > 0){
                $('#message').children("small").remove();
            }

            $("#message").append("<small style='color: blue;'>You are spending " +  Math.round(oneMinuteCost) + " $ each minute</small>");
        } else if ($('#total_videos').val() == "" || $('#video_length').val() == ""  || $('#total_budget').val() == " "){
            $('#message').children("small").remove();
        }
    });

    var counter2 = 0
    $('#video_length').on('input', function() {

        if ( $('#total_videos').val() != "" && $('#video_length').val() != ""  && $('#total_budget').val() != ""){
            counter2 = counter2 + 1;
            var totalMinutes = $('#total_videos').val() * $('#video_length').val()
            var totalBudget = $('#total_budget').val();

            var oneMinuteCost = totalBudget/totalMinutes

            if (counter2 > 0){
                $('#message').children("small").remove();
            }

            $("#message").append("<small style='color: blue;'>You are spending " +  Math.round(oneMinuteCost) + " $ each minute</small>");
        } else if ($('#total_videos').val() == "" || $('#video_length').val() == ""  || $('#total_budget').val() == " "){
            $('#message').children("small").remove();
        }
    });

    $('#submit').click(function(e){

        var formModel = $('#order_form').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        
        if(!$("#order_form").valid()){
            alert("Please correct the indicated fields")
            return
        }
        $.ajax({
            url : "post/new/order",
            type : "POST",
            data : formModel,
            success : function(json){
                console.log(json)
                window.localStorage.setItem('objectid', json['data']['_id']);
                window.location = "/record/" + json['data']['_id'];
            },
            error : function(err){
                alert(err);
            }
        });
   });

    var modal = document.getElementById('showModal');
    var btn = document.getElementById('orders');

    var span = document.getElementsByClassName("close")[0];

    btn.onclick = function() {
        modal.style.display = "block";
       $("#showorders").click(function(e){
            e.preventDefault();
            // just for the demos, avoids form submit
            jQuery.validator.setDefaults({
              debug: true,
              success: "valid"
            });
            $( "#myform" ).validate({
              rules: {
                email_id: {
                  required: true,
                  email: true
                }
              }
            })
            if ($('#myform').valid()) {
                modal.style.display = "none";
                window.location = "/show/orders/" + $('#email_id').val();

            };
        });
        
    }
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
    }

});
