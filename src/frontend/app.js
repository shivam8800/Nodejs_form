$(document).ready(function(){

    $('#submit').click(function(){

    var formModel = {}
    var name = $('#name').val();
    var email = $('#email').val();

    formModel.name = name;
    formModel.email = email;


    $.ajax({
            url : "http://127.0.0.1:8080/post/userdetails",
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
