$(document).ready(function(){

    $('form').find("input[type=text]").each(function(ev){
        $(this).attr("placeholder", "We sent an OTP to " + localStorage.getItem('email'));
    });

    var objectid = localStorage.getItem('objectid');
   
       $('#resend_otp').click(function(e){
            $.ajax({
                url : "/resend/otp/" + objectid,
                type : "PUT",
                data : {email: localStorage.getItem('email')},
                success : function(json){
                    window.location = "http://127.0.0.1:8080/otp/" + json["data"]['_id'] 
                },
                error : function(err){
                    alert(err);
                }
            });
    });

    $('#submit').click(function(e){
        $.ajax({
                url : "/auth",
                type : "POST",
                data : {email: localStorage.getItem('email'), otp: $('#OTP').val()},
                success : function(json){
                    console.log(json['data']['0']['_id']);
                    console.log(json);
                    if (json['status'] == "success"){
                        window.location = "http://127.0.0.1:8080/talent/" + json['data']['0']['_id']                     
                    } else {
                        alert(json);
                    }
                },
                error : function(err){
                    alert(err);
                }
            });
    });

});
