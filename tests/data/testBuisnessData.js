import * as businessFunctions from "../../data/business.js";

// Valid Input Testing

try {
    // Testing getAllBusinessWithPrefix
    let business = await businessFunctions.getAllBusinessWithPrefix("napo");
    if(business){
        console.log(business);
        console.log("getBusinessById passed");
    }
}
catch (error) {
    console.log(error);
}

// testing addReviews, get Reviews and delete review
try {
    let business = await businessFunctions.getBusinessByName("Napoli's Pizzeria");
    let businessId = business._id.toString();
    let addReview = await businessFunctions.addReview("6570c556cb2c09ab6e9610e9", businessId)
    console.log("add Review in buisness",addReview);
    let getReview = await businessFunctions.getAllReview(businessId)
    console.log("get Reviews in buisness",getReview);
    let deleteReview = await businessFunctions.deleteReview("6570c556cb2c09ab6e9610e9", businessId)
    console.log("delete Review in buisness",deleteReview);    
} catch (error) {
    console.log(error);
}

// testing getBusinessById
try {
    let business = await businessFunctions.getBusinessByName("Honest");
    let businessId = business._id.toString();
    let deleteBusiness = await businessFunctions.deleteBusiness(businessId)
    console.log("delete Business",deleteBusiness);
    
} catch (error) {
    console.log(error);
}
