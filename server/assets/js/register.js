$(function() {
  $("#register_button").click(function() {
  		// get the cip user typed in the login input field
  		var cip = $("#register").val();
      var type = getSelectedText('type_account');
  		// try to login the user
  		$.post("/api/accounts", { name: cip, type: type })
  			// login the user
  			.done(function(data) {
  				// put information of the user in session
  				Cookies.set('name', cip);
  				Cookies.set('id', data.id);
  				Cookies.set('type', type);

  				// redirect to the correct web view
  				if (type == "CUSTOMER")
		    		$.redirect('/app/student', null, "GET");
		    	else
		    		$.redirect('/app/merchant/products', null, "GET");
		  	})

		  	// login failed
		  	.fail(function(response) {
		  		var error = response.responseJSON;
		  		console.log(error);
		    	alert( "Error while login : " + error.message);
			});
  });
});
function getSelectedText(elementId) {
    var elt = document.getElementById(elementId);
    if (elt.selectedIndex == -1)
        return null;

    return elt.options[elt.selectedIndex].text;
}
