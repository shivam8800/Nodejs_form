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
                console.log(json)
            },
            error : function(err){
                alert(err);
            }
        });
        $.ajax({
          url: 'http://127.0.0.1:8080/get/user/'+ formModel["email"],
          type: 'GET',
          success: function(result) {
            window.localStorage.setItem('email', formModel["email"]);
            window.location = "http://127.0.0.1:8080/record/" + result['data']['0']['_id'];
          },
          error : function(err){
              alert(err);
          }
      });

   });

});
