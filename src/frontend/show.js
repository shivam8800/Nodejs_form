$(document).ready(function(){

	

	$( window ).load(function() {
	  var objectid = localStorage.getItem('objectid')

		$.ajax({
	          url: 'http://127.0.0.1:8080/get/order/'+ objectid,
	          type: 'GET',
	          success: function(result) {
	              $('#name1').val(result['data']['0']['name']);
	              $('#email').val(result['data']['0']['email']);
	              $('#country_code').val(result['data']['0']['countryCode']);
	              $('#phonnumber').val(result['data']['0']['phone_number']);
	              $('#interviewed_people').val(result['data']['0']['interviewed_people']);
	              $('#shoot_cities').val(result['data']['0']['shoot_cities']);
	              $('#total_videos').val(result['data']['0']['total_videos']);
	              $('#video_length').val(result['data']['0']['video_length'].toString() + " minutes");
	              $('#total_budget').val(result['data']['0']['total_budget']);
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