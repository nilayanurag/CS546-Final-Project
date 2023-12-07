import * as businessFunctions from "../../data/business.js";
import * as reviewsFunctions from "../../data/review.js";

// Valid Input Testing

try {
    // Testing getAllBusinessWithPrefix
    let business = await businessFunctions.getAllBusinessWithPrefix("napo");
    if(business){
        console.log(business);
        console.log("Test 1: getBusinessById passed");
    }
}
catch (error) {
    console.log(error);
}

// testing addReviews, get Reviews and delete review
try {
    let business = await businessFunctions.getBusinessByName("Napoli's Pizzeria");
    let businessId = business._id.toString();
    let reviews = await reviewsFunctions.getAllReviews();
    let reviewId = reviews[0]._id.toString();
    let addReview = await businessFunctions.addReview(reviewId, businessId)
    console.log("Test 1: add Review in buisness:",addReview);
    let getReview = await businessFunctions.getAllReview(businessId)
    console.log("Test 2: get Reviews in buisness:",getReview);
    let deleteReview = await businessFunctions.deleteReview(reviewId, businessId)
    console.log("Test 3: delete Review in buisness:",deleteReview);    
} catch (error) {
    console.log(error);
}

// testing getBusinessById
try {
    let business = await businessFunctions.getBusinessByName("Honest");
    let businessId = business._id.toString();
    let deleteBusiness = await businessFunctions.deleteBusiness(businessId)
    console.log("Test 4: delete Business",deleteBusiness);
    
} catch (error) {
    console.log(error);
}
