$(document).ready(function(){
    
    $('#submit').click(function(e){
        var objectid = localStorage.getItem('objectid');

        var video = document.getElementById('file').files[0];

        if (video.name.split('.')[1] == 'mp4'){

            var form = new FormData();
            form.append("file", video);

              $.ajax({
                  url : 'http://127.0.0.1:8080/user/video/' + objectid,
                  type : "POST",
                  data : form,
                  processData: false,
                  contentType: false,
                  mimeType: "multipart/form-data",
                  success : function(json) {
                    location.reload()
                  },
                  error: function(err){
                      alert(err);
                      console.log("this is error",err);
                  }
              });
        } else {
            alert("Please upload mp4 file. ")
        }

    });
    
});