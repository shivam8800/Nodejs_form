$(document).ready(function(){

    $('#login').click(function(e){
        window.location = 'http://127.0.0.1:8080/login';
    });

    $("#signup_form").validate();
    
    $('#submit').click(function(e){

        var userModel = $('#signup_form').serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        
        if(!$("#signup_form").valid()){
            alert("Please correct the indicated fields")
            return
        }
        $.ajax({
            url : "create/newuser",
            type : "POST",
            data : userModel,
            success : function(json){
                window.localStorage.setItem('objectid', json['data']['_id']);
                window.localStorage.setItem('email', $('#email').val());
                window.location = "http://127.0.0.1:8080/otp/" + json["data"]['_id'] 
                console.log(json);
            },
            error : function(err){
                alert(err);
            }
        });
   });
});
