$(function() {
  $("#login_button").click(function() {
  		// get the cip user typed in the login input field
  		var cip = $("#login").val();
  		// try to login the user
  		$.post("/api/accounts/login", { name: cip })
  			// login the user
  			.done(function(data) {
  				// put information of the user in session
  				Cookies.set('name', cip);
  				Cookies.set('id', data.id);
  				Cookies.set('type', data.type);

  				// redirect to the correct web view
  				if (data.type == "CUSTOMER")
		    		$.redirect('/app/student');
		    	else
		    		$.redirect('/app/merchant');
		  	})
		  	// login failed
		  	.fail(function(response) {
		  		var error = response.responseJSON;
		  		console.log(error);
		    	alert( "Error while login : " + error.message);
			});
  });
});