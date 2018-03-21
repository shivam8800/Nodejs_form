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
            url : "post/userdetails",
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

});
