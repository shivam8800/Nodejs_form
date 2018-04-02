$(document).ready(function(){

		var counter = 0
	    $('#total_budget').on('input', function() {

	        if ( $('#total_videos').val() != "" && $('#video_length').val() != ""  && $('#total_budget').val() != ""){
	            counter = counter + 1;
	            var totalMinutes = $('#total_videos').val() * $('#video_length').val()
	            var totalBudget = $('#total_budget').val();

	            var oneMinuteCost = totalBudget/totalMinutes

	            if (counter > 0){
	                $('#message').children("small").remove();
	            }

	            $("#message").append("<small style='color: blue;'>You are spending " +  Math.round(oneMinuteCost) + " $ each minute</small>");
	        } else if ($('#total_videos').val() == "" || $('#video_length').val() == ""  || $('#total_budget').val() == " "){
	            $('#message').children("small").remove();
	        }
	    });

	    var counter1 = 0
	    $('#total_videos').on('input', function() {

	        if ( $('#total_videos').val() != "" && $('#video_length').val() != ""  && $('#total_budget').val() != ""){
	            counter1 = counter1 + 1;
	            var totalMinutes = $('#total_videos').val() * $('#video_length').val()
	            var totalBudget = $('#total_budget').val();

	            var oneMinuteCost = totalBudget/totalMinutes

	            if (counter1 > 0){
	                $('#message').children("small").remove();
	            }

	            $("#message").append("<small style='color: blue;'>You are spending " +  Math.round(oneMinuteCost) + " $ each minute</small>");
	        } else if ($('#total_videos').val() == "" || $('#video_length').val() == ""  || $('#total_budget').val() == " "){
	            $('#message').children("small").remove();
	        }
	    });

	    var counter2 = 0
	    $('#video_length').on('input', function() {

	        if ( $('#total_videos').val() != "" && $('#video_length').val() != ""  && $('#total_budget').val() != ""){
	            counter2 = counter2 + 1;
	            var totalMinutes = $('#total_videos').val() * $('#video_length').val()
	            var totalBudget = $('#total_budget').val();

	            var oneMinuteCost = totalBudget/totalMinutes

	            if (counter2 > 0){
	                $('#message').children("small").remove();
	            }

	            $("#message").append("<small style='color: blue;'>You are spending " +  Math.round(oneMinuteCost) + " $ each minute</small>");
	        } else if ($('#total_videos').val() == "" || $('#video_length').val() == ""  || $('#total_budget').val() == " "){
	            $('#message').children("small").remove();
	        }
	    });

		var objectid = localStorage.getItem('objectid')		
	    $("#order_form1").validate();
	    $('#submit1').click(function(e){
            var formModel = $('#order_form1').serializeArray().reduce(function(obj, item) {
	            obj[item.name] = item.value;
	            return obj;
	        }, {});
	        console.log(formModel);
	        console.log($('.ms-sel-item').text());
	        if(!$("#order_form1").valid()){
	            alert("Please correct the indicated fields")
	            return
	        }
	        // $.ajax({
	        //     url : "http://127.0.0.1:8080/update/order/" + objectid,
	        //     type : "PUT",
	        //     data : formModel,
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