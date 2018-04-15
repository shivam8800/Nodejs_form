$(document).ready(function(){

    $('#submit').click(function(e){
        var email = $('#email').val();  
        $.ajax({
                url : "/get/userdetail/" + email,
                type : "GET",
                success : function(json){
                    var objectid = json['data']['0']['_id'];
                    $.ajax({
                        url : "/resend/otp/" + objectid,
                        type : "PUT",
                        data : {email: email},
                        success : function(json){
                            window.location = "http://127.0.0.1:8080/otp/" + json["data"]['_id'] 
                        },
                        error : function(err){
                            alert(err);
                        }
                    });
                },
                error : function(err){
                    alert(err);
                }
            });
    });

});
