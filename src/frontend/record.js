// This example uses MediaRecorder to record from a live audio stream,
// and uses the resulting blob as a source for an audio element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get audio stream from microphone
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we can use as audio src

var recordButton, stopButton, recorder;
  var recordedChunks = [];

window.onload = function () {
  recordButton = document.getElementById('record');
  stopButton = document.getElementById('stop');


  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = handleDataAvailable;

    function handleDataAvailable(event) {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      } else {
        console.log("j");
      }
    }
    // listen to dataavailable, which gets triggered whenever we have
    // an audio blob available
    recorder.addEventListener('dataavailable', onRecordingReady);
  });
};

function startRecording() {
  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.stop();
}

function onRecordingReady(e) {
  var audio = document.getElementById('audio');
  // e.data contains a blob representing the recording
  audio.src = URL.createObjectURL(e.data);
  audio.play();
}

var file;

function download() {
  var blob = new Blob(recordedChunks, {
    type: 'audio/webm'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'audio.mp3';
  // a.click();
  window.URL.revokeObjectURL(url);
  file = new File([blob], $('#email').val()+ '.mp3', {type: 'audio/webm', lastModified: Date.now()});
}


$('#submit').click(function(){

    var formModel = {}
    var name = $('#name').val();
    var email = $('#email').val();

    formModel.name = name;
    formModel.email = email;


    $.ajax({
            url : "https://complain-form.herokuapp.com/post/userdetails",
            type : "POST",
            data : formModel,
            success : function(json){
                location.reload();
                console.log(formModel)
           },
            error : function(err){
                alert(err);
            }
        });

    // download();
    // var audioFile = file;
    // var form = new FormData();
    // form.append("file", audioFile);
    //   $.ajax({
    //       url : "http://localhost:5000/audio",
    //       type : "POST",
    //       data : form,
    //       processData: false,
    //       contentType: false,
    //       mimeType: "multipart/form-data",
    //       success : function(json) {
    //           console.log("yeah got it!")
    //           console.log(json);
    //       },
    //       error: function(err){
    //           alert(err);
    //           console.log(err);
    //       }
    //   });


   });
