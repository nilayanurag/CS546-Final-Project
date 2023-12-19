$(document).ready(function() {
    $('#updateUser-form').submit(function(event) {
        
        var isValid = true;
        
        $('.errorMessage').remove();

        
        let firstName = $("#firstNameInput").val().trim();
        if (firstName.length < 2 || firstName.length > 25) {
            isValid = false;
            $("#firstNameInput").after("<div class='errorMessage'>First Name must be between 2 and 25 characters</div>");
        }
        let lastName = $("#lastNameInput").val().trim();
        if (lastName.length < 2 || lastName.length > 25) {
            isValid = false;
            $("#lastNameInput").after("<div class='errorMessage'>Last Name must be between 2 and 25 characters</div>");
        }
        let username = $("#usernameInput").val().trim();
      
        if (username.length < 2 || username.length > 25) {
            isValid = false;
            $("#usernameInput").after("<div class='errorMessage'>Username must be between 2 and 25 characters</div>");
        }
        let age = $("#ageInput").val().trim();
        if (age < 12 || age > 105) {
            isValid = false;
            $("#ageInput").after("<div class='errorMessage'>Age must be between 12 and 105</div>");
        }

        let sex = $("#sexInput").val().trim();
        if (!(sex=="male"||sex=="female"||sex=="other")) {
            isValid = false;
            $("#sexInput").after("<div class='errorMessage'>sex must be from the option given</div>");
        }
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
        let confirmPassword = $("#confirmPasswordInput").val().trim();
        if (confirmPassword != password) {
            isValid = false;
            $("#confirmPasswordInput").after("<div class='errorMessage'>Passwords must match</div>");
        }
        let locationFirstLineInput = $("#locationFirstLineInput").val().trim();
        if (locationFirstLineInput.length < 1 || locationFirstLineInput.length > 50) {
            isValid = false;
            $("#locationFirstLineInput").after("<div class='errorMessage'>Location must be between 1 and 50 characters</div>");
        }

        let locationLastLineInput = $("#locationLastLineInput").val().trim();
        if (locationLastLineInput.length < 1 || locationLastLineInput.length > 50) {
            isValid = false;
            $("#locationLastLineInput").after("<div class='errorMessage'>Location must be between 1 and 50 characters</div>");
        }
        let countryInput = $("#countryInput").val().trim();
        if (countryInput.length < 2 || countryInput.length > 50) {
            isValid = false;
            $("#countryInput").after("<div class='errorMessage'>Country must be between 1 and 50 characters</div>");
        }
        let cityInput = $("#cityInput").val().trim();
        if (cityInput.length < 3 || cityInput.length > 50) {
            isValid = false;
            $("#cityInput").after("<div class='errorMessage'>City must be between 1 and 50 characters</div>");
        }
        let stateInput = $("#stateInput").val().trim();
        const allState= ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
            'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
            'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
            'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
            'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
        if (stateInput.length !=2||!(allState.includes(stateInput.toUpperCase()))) {
        
            if (!isUsState){
                isValid = false;
                $("#stateInput").after("<div class='errorMessage'>Invalid state</div>");
            }
           
        }
        let zipInput = $("#zipInput").val().trim();
        if (zipInput.length !=5) {
            isValid = false;
            $("#zipInput").after("<div class='errorMessage'>Zip must be 5 digits</div>");
        }
  
        

        if(!isValid) {
            event.preventDefault(); // Prevent form submission if validation fails
        }
        
    })
});