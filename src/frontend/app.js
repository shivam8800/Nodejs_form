$(document).ready(function(){
   $('#show').click(function(){
        $('#showdetails').modal({
            show: 'true'
        });


        $('#showpage').click(function(){

            var emailid = $('#emailid').val();
            if (emailid != ""){

                $.ajax({
                    url: 'https://complain-form.herokuapp.com/get/user/'+ emailid,
                    type: 'GET',
                    success: function(result) {
                        window.localStorage.setItem('name', result['data']['0']['name']);
                        window.localStorage.setItem('email', emailid);
                        window.location = "show.html";
                    },
                    error : function(err){
                        alert(err);
                        console.log(err);
                    }
                });
            } else {
                alert("please put user emailid so that we can give you that user details")
            }
        });


   });
});
