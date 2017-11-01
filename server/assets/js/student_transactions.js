$(function() {
  // get user information from cookies
  var name = Cookies.get('name');
  var id = Cookies.get('id');
  var type = Cookies.get('type');

  // initialize GUI
  $("#cip").text(" - " + name);
  
});