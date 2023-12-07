import { ObjectId } from 'mongodb';
import * as EmailValidator from 'email-validator';
import { users } from "../config/mongoCollections.js"

export function checkStringHelper(strVal, varName) {
    if (!varName) varName = "Value"
    if (!strVal) throw `Error: You must supply a ${varName}!`;
    if (typeof strVal !== 'string') throw `Error: ${varName} must be a string!`;
    strVal = strVal.trim();
    if (strVal.length === 0)
        throw `Error: ${varName} cannot be an empty string or string with just spaces`;
    return strVal;
}

export function checkString(strVal, varName, lowerbound, upperbound) {
    strVal = checkStringHelper(strVal, varName)
    if (!lowerbound) { return strVal }
    else if (strVal.length < lowerbound) { throw `Error: ${strVal} must atleast ${lowerbound} in size!` }
    if (!upperbound) { return strVal }
    else if (strVal.length > upperbound) { throw `Error: ${strVal} is at max ${upperbound} in size!` }
    return strVal;
}

export function checkSex(sex) {
    sex = checkString(sex, "sex", 4, 8).toLowerCase()
    if (sex == "male") {
        return "male"
    } else if (sex == "female") {
        return "female"
    } else if (sex == "other") {
        return "other"
    }
    else {
        throw "sex info not available"
    }
}

export function checkAge(age, lowerbound, upperbound) {
    if (typeof(age)=="string"){
        age=checkStringIsNum(age)
        age=Number(age)
    }else{
        age=isNumber(age)
    }
    age = isInteger(age)
    if (!lowerbound) { return age }
    else if (age < lowerbound) { throw `Error: Age must atleast ${lowerbound} in value!` }
    if (!upperbound) { return age }
    else if (age > upperbound) { throw `Error: Age is at max ${upperbound} in value!` }
    return age;

}


export function isNumber(numVal) {
    if (typeof (numVal) !== 'number') throw "not a Number"
    if (isNaN(numVal)) throw "NaN is not a valid number"
    return numVal
}

export function isInteger(numVal) {
    numVal = isNumber(numVal)
    if (!Number.isInteger(numVal)) throw "Not an Integer"
    return numVal
}

export function checkWholeNumber(numVal) {
    numVal = isInteger(numVal)
    if (numVal < 0) throw "Number is negative"
    return numVal
}

export function checkNaturalNumber(numVal) {
    numVal = checkWholeNumber(numVal)
    if (numVal == 0) throw "Not a natural Number"
    return numVal
}

export function checkRating(rating, upperbound, lowerbound) {
    rating = checkWholeNumber(rating)
    if(rating<lowerbound || rating>upperbound) throw "Rating out of bound"
    return rating
}


export function checkStringIsNum(strVal, varName) {
    strVal = checkString(strVal, varName)
    if (strVal != Number(strVal)) throw "Not a number"
    return strVal
}

export function checkObjectId(str) {
    str = checkString(str, "ObjectId")
    if (!ObjectId.isValid(str)) throw 'invalid object ID';
    return str
}

export function getNumberStringOfSize(str, size) {
    str = checkStringIsNum(str)
    if (size) {
        if (str.length != size) throw "invalid size"
    }
    return num
}

export function checkValidEmail(emailId) {
    emailId = checkString(emailId, "emailId")
    //Using existin package https://www.npmjs.com/package/email-validator
    if (EmailValidator.validate(emailId)) {
        return emailId.toLowerCase()
    }
    else {
        throw "Not Valid Email"
    }
}

export async function checkIfEmailPresent(emailId) {
    emailId = checkValidEmail(emailId)
    
    const userCollection = await users();
    const userInfo = await userCollection.findOne({ contactEmail: emailId });

    if (userInfo) {
        throw "Email Already exist"
    }

    return emailId
   
}

export function checkPass(password) {
    //temprory changing to less lengh got easy testing changit back to 8
    password = checkString(password, "password",3)
    let upperCheck = false
    let numCheck = false
    let specialCheck = false
    for (let each of password) {
        if (/[A-Za-z]/.test(each)) {
            if (each === each.toUpperCase()) {
                upperCheck = true
            }
        } else if (/\d/.test(each)) {
            numCheck = true
        } else {
            specialCheck = true
        }
    }

    if (upperCheck & numCheck & specialCheck) {
        return password
    } else {
        throw "Password not valid Format.Check ruleset"
    }

}

export function checkSamePass(password, cnfPassword) {
    password = checkPass(password)
    cnfPassword = checkPass(cnfPassword)
    if (password === cnfPassword) {
        return password
    } else {
        throw "Both Password much be same"
    }
}


export function checkAddress(addressObject) {
    if (typeof (addressObject) != "object") throw "Not obj"
    addressObject.firstLine = checkString(addressObject.firstLine, "firstAddressLine", 1, 50)
    addressObject.lastLine = checkString(addressObject.lastLine, "lastAddressLine", 1, 50)
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

export function checkArray(arr, varName) {
    if (!varName) varName="Value"
    if (!arr) throw `Error: You must supply a ${varName}!`;
    if (!Array.isArray(arr)) throw `Error: ${varName} must be an array!`;

    return arr;
}

export function checkArrayOfObjectIds(arr, varName) {
    arr=checkArray(arr,varName)
    for (let i=0;i<arr.length;i++){
        arr[i]=checkObjectId(arr[i])
    }
    return arr
}

export function checkArrayOfStrings(arr, varName) {
    arr=checkArray(arr,varName)
    for (let i=0;i<arr.length;i++){
        arr[i]=checkString(arr[i])
    }
    return arr
}


