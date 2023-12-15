import * as reviewFunctions from "../data/review.js";
import * as userFunctions from "../data/users.js";
import * as businessFunctions from "../data/business.js";

export const seedAllReview = async () => {
    try {
        const business = await businessFunctions.getBusinessByName("Napoli's Pizzeria");
        const businessId = business._id.toString();
        const categoryId = business.categoryId.toString();
        const user = await userFunctions.getUserByUsername("Nancy");
        const userId = user[0]._id.toString();
    
        const review = await reviewFunctions.createReview(
            businessId,
            userId,
            categoryId,
            4,
            "The ambience of Napoli's pizzeria was amazing and food was delightful as well. A must visit resto",
            "./public/images/testImage.png"
        );
        if(review.insertedReview){
            console.log("Review seeded");
        }else{
            console.log("Review not seeded");
        }
    } catch (error) {
        throw error;
    }
    try {
        const business = await businessFunctions.getBusinessByName("Patel Brothers");
        const businessId = business._id.toString();
        const categoryId = business.categoryId.toString();
        const user = await userFunctions.getUserByUsername("Nancy");
        const userId = user[0]._id.toString();
    
        const review = await reviewFunctions.createReview(
            businessId,
            userId,
            categoryId,
            5,
            "The Shopping experience of Indian groceries. A must visit grocery shop",
            "./public/images/testImage.png"
        );
        if(review.insertedReview){
            console.log("Review seeded");
        }else{
            console.log("Review not seeded");
        }
    } catch (error) {
        throw error;
    }
    try {
        const business = await businessFunctions.getBusinessByName("Chipotle");
        const businessId = business._id.toString();
        const categoryId = business.categoryId.toString();
        const user = await userFunctions.getUserByUsername("Nilay");
        const userId = user[0]._id.toString();
    
        const review = await reviewFunctions.createReview(
            businessId,
            userId,
            categoryId,
            4,
            "The tatse of the restraunt was fabulous specially the burrito bowl.",
            "./public/images/testImage.png"
        );
        if(review.insertedReview){
            console.log("Review seeded");
        }else{
            console.log("Review not seeded");
        }
    } catch (error) {
        throw error;
    }
    try {
        const business = await businessFunctions.getBusinessByName("Cinema");
        const businessId = business._id.toString();
        const categoryId = business.categoryId.toString();
        const user = await userFunctions.getUserByUsername("Nilay");
        const userId = user[0]._id.toString();
    
        const review = await reviewFunctions.createReview(
            businessId,
            userId,
            categoryId,
            5,
            "The Movie Experience was amazing in heart of manhattan",
            "./public/images/testImage.png"
        );
        if(review.insertedReview){
            console.log("Review seeded");
        }else{
            console.log("Review not seeded");
        }
    } catch (error) {
        throw error;
    }
    try {
        const business = await businessFunctions.getBusinessByName("Cinema");
        const businessId = business._id.toString();
        const categoryId = business.categoryId.toString();
        const user = await userFunctions.getUserByUsername("Dev");
        const userId = user[0]._id.toString();
    
        const review = await reviewFunctions.createReview(
            businessId,
            userId,
            categoryId,
            5,
            "The Movie Experience was amazing in heart of manhattan. New York Vibes",
            "./public/images/testImage.png"
        );
        if(review.insertedReview){
            console.log("Review seeded");
        }else{
            console.log("Review not seeded");
        }
    } catch (error) {
        throw error;
    }
    try {
        const business = await businessFunctions.getBusinessByName("Grocery");
        const businessId = business._id.toString();
        const categoryId = business.categoryId.toString();
        const user = await userFunctions.getUserByUsername("Raj");
        const userId = user[0]._id.toString();
    
        const review = await reviewFunctions.createReview(
            businessId,
            userId,
            categoryId,
            5,
            "Great Shopping time",
            "./public/images/testImage.png"
        );
        if(review.insertedReview){
            console.log("Review seeded");
        }else{
            console.log("Review not seeded");
        }
    } catch (error) {
        throw error;
    }
}

  const review = await reviewFunctions.createReview(
    businessId,
    userId,
    categoryId,
    4,
    "The ambience of Napoli's pizzeria was amazing and food was delightful as well. A must visit resto",
    "./public/images/testImage.png"
  );
  if (review.insertedReview) {
    console.log("Review seeded");
  } else {
    console.log("Review not seeded");
  }
