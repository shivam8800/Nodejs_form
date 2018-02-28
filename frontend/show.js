$(document).ready(function(){
   //get it from localStorage
   var name=localStorage.getItem('name'); 
   var email=localStorage.getItem('email');

   //set it to textboxes
   $('#name1').val(name);
   $('#email').val(email);

   var audio = document.getElementById('getaudio');
   audio.src = 'http://localhost:8080/get/userfile/' + email
});