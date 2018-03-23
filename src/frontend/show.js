$(document).ready(function(){

	

	$( window ).load(function() {
	  var objectid = localStorage.getItem('objectid')

		$.ajax({
	          url: 'http://127.0.0.1:8080/get/order/'+ objectid,
	          type: 'GET',
	          success: function(result) {
	              $('#name1').val(result['data']['0']['name']);
	              $('#email').val(result['data']['0']['email']);
	              $('#country_code').val(result['data']['0']['country_code']);
	              $('#phonnumber').val(result['data']['0']['phone_number']);
	              var audio = document.getElementById('getaudio');
	              audio.src = 'http://127.0.0.1:8080/get/userfile/' + objectid
	          },
	          error : function(err){
	              alert(err);
	              console.log(err);
	          }
	      });
	});
   
});