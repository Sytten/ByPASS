$(function() {
  // get user information from cookies
  var name = Cookies.get('name');
  var id = Cookies.get('id');
  var type = Cookies.get('type');

  // initialize GUI
  $("#cip").text(" - " + name);


  // render products table via ajax
  var updateProductTable = function() {
    $.post("/app/merchant/products/table", { id: id })
      .done(function(data) {
        $("#products_table").html(data);
      });
  }
  updateProductTable();
  

  var strHasError = function(str) {
    if (typeof str != 'string' || str.length == 0) {
      return true;
    }
    else {
      return false;
    }
  }

  var numHasError = function(num) {
    if (num.length == 0 || isNaN(num)) {
      return true;
    }
    else {
      return false;
    }
  }
  

  $("body").on('keypress', '.p_input', () => {
    $(".p_input").removeClass("p_error");
  });

  // create item button click
  $("#add_button").click(() => {
    // get variables to create item
    var p_add_name = $("#p_add_name");
    var p_add_desc = $("#p_add_desc");
    var p_add_price = $("#p_add_price");
    var p_add_sc = $("#p_add_sc");

    // check for input errors
    var error = 0;
    if(strHasError(p_add_name.val())) {
      p_add_name.addClass("p_error");
      error = 1;
    }

    if(strHasError(p_add_desc.val())) {
      p_add_desc.addClass("p_error");
      error = 1;
    }
    
    if(numHasError(p_add_price.val())) {
      p_add_price.addClass("p_error");
      error = 1;
    }

    if(numHasError(p_add_sc.val())) {
      p_add_sc.addClass("p_error");
      error = 1;
    }
    if (error == 1) {
      return;
    }


    // create new item
    $.post("/api/items", {
        name: p_add_name.val(),
        merchant: id,
        shortcut: p_add_sc.val(),
        description: p_add_desc.val(),
        price: p_add_price.val()
      }).done(function(data) {
        updateProductTable();
    }).fail(function(response) {
          var error = response.responseJSON;
          console.log(error);
          alert( "Error while adding item : " + error.message);
    });
  });
});