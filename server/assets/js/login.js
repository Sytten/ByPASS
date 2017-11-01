$(function() {
  $("#login_button").click(function() {
  		$.redirect('/app/student', {'id': $("#login").val()});
  });
});