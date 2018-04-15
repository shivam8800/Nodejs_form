$(document).ready(function(){

    var objectid = localStorage.getItem('objectid');
   
       $('#resend_otp').click(function(e){
            $.ajax({
                url : "http://127.0.0.1:8080/resend/otp/" + objectid,
                type : "PUT",
                data : {email: localStorage.getItem('email')},
                success : function(json){
                    window.location = "http://127.0.0.1:8080/otp/" + json["data"]['_id'] 
                },
                error : function(err){
                    alert(err);
                }
            });
    })
});
