$(document).ready(function(){
	var emailid =window.location.href.split('/')[5]

	$.ajax({
	      url: 'http://127.0.0.1:8080/get/orders/'+ emailid,
	      type: 'GET',
	      success: function(result) {
	      		console.log(result['data']);
	  			for (var i = 0; i < result['data'].length; i++) {
	  				var trHTML = '';
	  				console.log(i);
	  				var cities = result['data'][i]['shoot_cities']
	          		var finalcities = ""
	          		for (var i =0; i < cities.length; i++) {
	          			if (i == cities.length -1){
	          				finalcities = finalcities + cities[i]	
	          			} else {
	          			finalcities = finalcities + cities[i] + ","
	          			}	
	          		}

	  				trHTML = "<tr><th>" + i + "</th><td>"+ result['data'][i]["name"] + "</td><td><p><audio id='getaudio' src='http://127.0.0.1:8080/get/userfile/" + result['data'][i]["_id"]+"' controls></audio></p></td><td>"+ result['data'][i]["email"] +"</td><td>"+result['data'][i]["countryCode"] +"-"+result['data'][i]["phone_number"] +"</td><td>"+result['data'][i]["interviewed_people"]+"</td><td>"+finalcities+"</td><td>"+result['data'][i]["total_videos"]+"</td><td>"+result['data'][i]["video_length"] +"minutes</td><td>"+result['data'][i]["total_budget"] +"$</td></tr>"
	  	        	$('#myTable').append(trHTML);
	  	        }
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