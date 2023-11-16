import {ObjectId} from 'mongodb';

export function checkString(strVal, varName,lowerbound,upperbound) {
    strVal=checkStringBasic(strVal,varName)
    if(!lowerbound) {return strVal}
    else if (strVal.length<lowerbound) {throw `Error: ${strVal} must atleast ${lowerbound} in size!`}
    if (!upperbound){return strVal}
    else if (strVal.length>upperbound) {throw `Error: ${strVal} is at max ${upperbound} in size!`}
    return strVal;
}


export function isNumber(numVal) {
    if (typeof(numVal)!=='number') throw "not a Number"   
    if (isNaN(numVal)) throw "NaN is not a valid number"
    return numVal
}

export function isInteger(numVal){
    numVal=isNumber(numVal)
    if (!Number.isInteger(numVal)) throw "Not an Integer"
}

export function checkWholeNumber(num){
    numVal=isInteger(numVal)
    if (num<0) throw "Number is negative"
}

export function checkNaturalNumber(num){
    numVal=checkWholeNumber(numVal)
    if (num==0) throw "Not a natural Number"
}


export function checkStringIsNum(strVal,varName){
    strVal=checkString(strVal,varName)
    if (strVal!=Number(strVal)) throw "Not a number"
    return strVal
}

export function checkObjectId(str){
    str=checkString(str,"ObjectId")
    if (!ObjectId.isValid(str)) throw 'invalid object ID';
    return str
}

export function getNumberStringOfSize(str,size){
    str=checkStringIsNum(str)
    if (size){
        if (str.length!=size) throw "invalid size"
    }
    return num
}


export function checkValidEmail(emailId){
    emailId=checkString(emailId,"emailId")
    //Using existin package https://www.npmjs.com/package/email-validator
    if (EmailValidator.validate(emailId)){
        return emailId
    }
    else{
        throw "Not Valid Email"
    }
}






