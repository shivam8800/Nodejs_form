$(document).ready(function(){

    $("#order_form").validate()  

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
            url : "post/userdetails",
            type : "POST",
            data : formModel,
            success : function(json){
                window.localStorage.setItem('email', email);
                window.location = "record.html";
                console.log(formModel)
            },
            error : function(err){
                alert(err);
            }
        });
        


        
   });

});
