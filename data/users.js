import * as helper from "../helpers/validation.js"
import {users} from "../config/mongoCollections.js"



export const create =async(
    firstName,
    lastName,
    sex,
    age,
    contactEmail,
    password,
    following,
    followers,
    tags,
    location
)=>{
    /*this is a basic template I have use from hw just to get it started* /
    firstName=helper.checkString(firstName,1,50)
    lastName=helper.checkString(lastName,1,50)
    sex=helper.checkString(sex)
    */

}
