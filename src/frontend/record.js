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
$('#stop').hide();
$('#audio').hide();
$('#pause').hide();
$('#resume').hide();

  $('#record').click(function(){
    $('#stop').show();
    $('#pause').show();
    $('#record').hide();
  });

  $('#pause').click(function(){
    $('#pause').hide();
    $('#resume').show();
  });

  $('#resume').click(function(){
    $('#pause').show();
    $('#resume').hide();
  });


$('#stop').click(function(){
  $('#audio').show();
  $('#pause').hide();
  $('#resume').hide(); 
  $('#stop').hide();
})

window.onload = function () {
  recordButton = document.getElementById('record');
  pauseButton = document.getElementById('pause');
  resumeButton = document.getElementById('resume');
  stopButton = document.getElementById('stop');


  // get audio stream from user's mic
  navigator.mediaDevices.getUserMedia({
    audio: true
  })
  .then(function (stream) {
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    
    pauseButton.addEventListener('click', pauseRecording);
    resumeButton.addEventListener('click', resumeRecording);

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
  pauseButton.disabled = false;

  recorder.start();
}

function pauseRecording() {
  stopButton.disabled = false;
  pauseButton.disabled = true;
  resumeButton.disabled = false;

  // Stopping the recorder will eventually trigger the `dataavailable` event and we can complete the recording process
  recorder.pause();
}

function resumeRecording() {
  stopButton.disabled = false;
  pauseButton.disabled = false;
  resumeButton.disabled = true;

  recorder.resume();
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
    type: 'audio/mp3'
  });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  a.href = url;
  a.download = 'audio.mp3';
  // a.click();
  window.URL.revokeObjectURL(url);
  file = new File([blob], localStorage.getItem('objectid')+ '.mp3', {type: 'audio/mp3', lastModified: Date.now()});
}

$('#saveaudio').click(function(){

    download();
    var audioFile = file;
    var form = new FormData();
    form.append("file", audioFile);


      $.ajax({
          url : 'http://127.0.0.1:8080/audio',
          type : "POST",
          data : form,
          processData: false,
          contentType: false,
          mimeType: "multipart/form-data",
          success : function(json) {
              var objectid=localStorage.getItem('objectid');
              window.location = "/show/" + objectid;
              window.localStorage.setItem('objectid', objectid);
          },
          error: function(err){
              alert(err);
              console.log("this is error",err);
          }
      });
});