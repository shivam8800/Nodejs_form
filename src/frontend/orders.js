$(document).ready(function(){
	var emailid =window.location.href.split('/')[5]

	$.ajax({
	      url: 'http://127.0.0.1:8080/get/orders/'+ emailid,
	      type: 'GET',
	      success: function(result) {
	     		console.log(result['data']);
	      },
	      error : function(err){
	          alert(err);
	          console.log(err);
	      }
	  });

  $("#myInput").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});