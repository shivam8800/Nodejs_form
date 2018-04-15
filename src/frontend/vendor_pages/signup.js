$(document).ready(function(){
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
                console.log(json);
            },
            error : function(err){
                alert(err);
            }
        });
   });
});
