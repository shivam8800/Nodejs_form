$(document).ready(function(){


    $('#submit').click(function(e){

        var formModel = {}
        var name = $('#name').val();
        var email = $('#email').val();
        var phonnumber = $('#phonnumber').val();

        formModel.name = name;
        formModel.email = email;
        formModel.phonnumber = phonnumber;

        function validateEmail(sEmail) {
            var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
            if (filter.test(sEmail)) {
                return true;
            }
            else {
                return false;
            }
        }
        
        function validatePhone(phoneText) {
            var filter = /^[0-9-+]+$/;
            if (filter.test(phoneText)) {
                return true;
            }
            else {
                return false;
            }
        }



        if ($.trim(email).length == 0 && $.trim(phonnumber).length == 0) {
            alert('Please enter valid email address or phon number');
            e.preventDefault();
        }
        if (validateEmail(email) && validatePhone(phonnumber)){
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
        }
        else {
            alert('Invalid Email Address or phon number');
            e.preventDefault();
        }


        
   });
});
