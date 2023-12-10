import * as reviewFunctions from "../data/review.js";
import * as userFunctions from "../data/users.js";
import * as businessFunctions from "../data/business.js";

export const seedAllReview = async () => {
try {
  const business = await businessFunctions.getBusinessByName(
    "Napoli's Pizzeria"
  );
  const businessId = business._id.toString();
  const categoryId = business.categoryId.toString();
  const user = await userFunctions.getUserByUsername("nilayanurag");
  const userId = user[0]._id.toString();

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
} catch (error) {
  throw error;
}
}
