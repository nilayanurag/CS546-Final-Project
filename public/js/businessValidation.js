var businessForm = document.getElementById('businessForm');

if(businessForm){
    document.getElementById('registration-form').addEventListener('submit', function(event) {
        resetErrors();
        try {
            validateName(document.getElementById('businessName').value);
            checkAddress({
                firstLine: document.getElementById('firstAddressLine').value,
                lastLine: document.getElementById('lastAddressLine').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                zip: document.getElementById('zip').value,
                country: document.getElementById('country').value
            });
        } catch (error) {
            event.preventDefault(); 
            displayError(error);
        }
    });
}

function checkStringHelper(strVal, varName) {
    if (!varName) varName = "Value"
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
}

function checkString(strVal, varName, lowerbound, upperbound) {
    strVal = checkStringHelper(strVal, varName)
    if (!lowerbound) { return strVal }
    else if (strVal.length < lowerbound) { throw `Error: ${strVal} must atleast ${lowerbound} in size!` }
    if (!upperbound) { return strVal }
    else if (strVal.length > upperbound) { throw `Error: ${strVal} is at max ${upperbound} in size!` }
    return strVal;
}

function validateName(name) {
    if (name.length < 1 || name.length > 100) {
        throw "Name must be between 1 and 100 characters long.";
    }
}

function checkStringIsNum(strVal, varName) {
    strVal = checkString(strVal, varName)
    if (strVal != Number(strVal)) throw "Not a number"
    return strVal
}

function checkWholeNumber(numVal) {
    numVal = isInteger(numVal)
    if (numVal < 0) throw "Number is negative"
    return numVal
}

function checkAddress(addressObject) {
    
    if (typeof (addressObject) != "object") throw "Not obj"
    addressObject.firstLine = checkString(addressObject.firstLine, "firstAddressLine", 1, 50)
    
    if (!addressObject.lastLine || addressObject.lastLine.trim() === "") {
        throw "Error: Last address line cannot be empty";
    } else {
        addressObject.lastLine = checkString(addressObject.lastLine, "lastAddressLine", 1, 50);
    }
    addressObject.city = checkString(addressObject.city, "city", 3, 50)
    addressObject.country = checkString(addressObject.country, "country", 2)
    let state = checkString(addressObject.state, "state", 2).toUpperCase()
    const states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA',
        'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME',
        'MI', 'MN', 'MO', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM',
        'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
        'UT', 'VA', 'VT', 'WA', 'WI', 'WV', 'WY']
    if (states.includes(state)) { }
    else { throw "Not valid state" }
    addressObject.state = state
    let zip = checkString(addressObject.zip, "Zip", 5)
    if (zip.length != 5) throw "invalid"
    checkWholeNumber(Number(checkStringIsNum(zip)))
    addressObject.zip = zip

    return addressObject
}

// Function to reset any previous error messages
function resetErrors() {
    let errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.textContent = '';
        message.style.display = 'none';
    });
}

// Function to display error messages
function displayError(message) {
    let errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}