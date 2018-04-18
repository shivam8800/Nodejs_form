$(document).ready(function(){
    
    $("#info_form").validate();
    $('#submit').click(function(e){
        var formModel = $('#info_form').serializeObject();

        if(!$("#info_form").valid()){
            alert("Please correct the indicated fields")
            return
        }

        var objectid = localStorage.getItem('objectid');
        console.log(objectid)
        $.ajax({
            url : "http://127.0.0.1:8080/update/user/vitalinfo/" + objectid,
            type : "PUT",
            data : { formModel: JSON.stringify(formModel)},
            success : function(json){
                // window.localStorage.setItem('objectid', json['data']['_id']);
                // window.location = "/record/" + json['data']['_id'];
                console.log(json);
            },
            error : function(err){
                alert(err);
            }
        });
    });
});