$(document).ready(function(){

    $('#signup').click(function(e){
        window.location = "http://127.0.0.1:8080/signup"
    });

    // if (localStorage.getItem('name') != ""){
    //     $("#name").val(localStorage.getItem('name'));
    //     $("#email").val(localStorage.getItem('email'));
    //     $("#countryCode").val(localStorage.getItem('countryCode'));
    //     $("#phonnumber").val(localStorage.getItem('phone_number'));
    //     console.log(localStorage.getItem("name"));
    // }

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
                window.location = "/additionalDetail/" + json['data']['_id'];
            },
            error : function(err){
                alert(err);
            }
        });
   });

    
    $("#toggle-action").click(()=>{
        if($("#toggle-action").data('form-state')=='signup'){
            $(".phonedetails").addClass('hide')
            $(".linkedin-group").addClass('hide')
            $("#name").addClass('hide')
            $("#toggle-action").text('Create an account')

            $("#toggle-action").data('form-state','login')
        }else{
            $(".phonedetails").removeClass('hide')
            $(".linkedin-group").removeClass('hide')
            $("#name").removeClass('hide')
            $("#toggle-action").text('Have an account?')

            $("#toggle-action").data('form-state','signup')
        }
        
    })

});
