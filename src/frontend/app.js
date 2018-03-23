$(document).ready(function(){

    $("#order_form").validate();

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
                // $.ajax({
                //   url: 'http://127.0.0.1:8080/get/orders/'+ $('#email_id').val(),
                //   type: 'GET',
                //   success: function(result) {
                //       console.log(result);
                //   },
                //   error : function(err){
                //       alert(err);
                //       console.log(err);
                //   }
                // });
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
