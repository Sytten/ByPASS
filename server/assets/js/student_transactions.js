$(function() {
  // get user information from cookies
  var name = Cookies.get('name');
  var id = Cookies.get('id');
  var type = Cookies.get('type');

  // initialize GUI
  $("#cip").text(" - " + name);

  // render transaction table via ajax
  $.post("/app/student/transactions_table", { id: id })
    .done(function(data) {
      $("#transactions_table").html(data);
    });

   // render total via ajax
  $.post("/app/student/total", { id: id })
    .done(function(data) {
      console.log(data)
      $("#total").text(data.total.toFixed(2) + "$");
    });


});