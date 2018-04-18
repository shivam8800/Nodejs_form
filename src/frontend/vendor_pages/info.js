$(document).ready(function(){
    
    $("#info_form").validate();
    $('#submit').click(function(e){
        var formModel = $('#info_form').serializeObject();

        if(!$("#info_form").valid()){
            alert("Please correct the indicated fields")
            return
        }

        console.log(formModel);
        // $.ajax({
        //     url : "http://127.0.0.1:8080/update/order/" + objectid,
        //     type : "PUT",
        //     data : { formModel: JSON.stringify(formModel)},
        //     success : function(json){
        //         window.localStorage.setItem('objectid', json['data']['_id']);
        //         window.location = "/record/" + json['data']['_id'];
        //     },
        //     error : function(err){
        //         alert(err);
        //     }
        // });
    });
});