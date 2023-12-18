(function ($) {
    $("#login-form").submit(function(event) {
        
        var isValid = true;

        $('.errorMessage').remove();
        let contactEmail = $("#contactEmailInput").val().trim();
        if (contactEmail.length < 10 || contactEmail.length > 50) {
            isValid = false;
            $("#contactEmailInput").after("<div class='errorMessage'>Email must be between 10 and 50 characters</div>");
        }
        let password = $("#passwordInput").val().trim();
        if (password.length < 8 || password.length > 50) {
            var upperCheck = /[A-Z]/.test(password);
            var numCheck = /\d/.test(password);
            var specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);
            if (!upperCheck || !numCheck || !specialCheck) {
                isValid = false;
                $("#passwordInput").after("<div class='errorMessage'>Password must be between 8 and 50 characters</div>");
            }
        }

        if(!isValid) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
        
    })
})(jQuery);
