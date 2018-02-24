$(document).ready(function(){ 
   $('#submit').click(function(){

        var formModel = {}
        var name = $('#name').val();
        var email = $('#email').val();

        formModel.name = name;
        formModel.email = email;

        $.ajax({
                url : "http://127.0.0.1:8080/api/form",
                type : "POST",
                data : formModel,
                success : function(json){
                    location.reload();
                },
                error : function(err){
                    alert(err);
                }
            });
   })
});
