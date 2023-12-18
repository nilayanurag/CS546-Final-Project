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
    const user = await userFunctions.getUserByUsername("nancyradadia");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      4,
      "The ambience of Napoli's pizzeria was amazing and food was delightful as well. A must visit resto",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const business = await businessFunctions.getBusinessByName(
      "Patel Brothers"
    );
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("nancyradadia");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      5,
      "The Shopping experience of Indian groceries. A must visit grocery shop",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const business = await businessFunctions.getBusinessByName("Chipotle");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("hitarthpatel");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      4,
      "The tatse of the restraunt was fabulous specially the burrito bowl.",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const business = await businessFunctions.getBusinessByName("AMC Newport");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("hitarthpatel");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      5,
      "The Movie Experience was amazing in heart of manhattan",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const business = await businessFunctions.getBusinessByName("AMC Empire 25");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("prashilpatel");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      5,
      "The Movie Experience was amazing in heart of manhattan. New York Vibes",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const business = await businessFunctions.getBusinessByName("Heights Fitness");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("prashilpatel");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      4,
      "Too costly but the gym is amazing. The trainers are very helpful and the equipments are very good. A must visit gym",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    throw error;
  }

  try {
    const business = await businessFunctions.getBusinessByName("Planet Fitness");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("harvishJ");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      1,
      "I would not recommend this gym to anyone. The trainers are not helpful and the equipments are not good. A must not visit gym",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const business = await businessFunctions.getBusinessByName("Hoboken Park");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("harvishJ");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      4,
      "It is a very good park. The park is very clean and the equipments are very good. A must visit park",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const business = await businessFunctions.getBusinessByName("6th Borough Salon");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("nilayanurag");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      2,
      "The salon is not good. The staff is not good and the equipments are not good. A must not visit salon",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const business = await businessFunctions.getBusinessByName("Honest");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("nilayanurag");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      4,
      "The food is very good. The staff is very good and the equipments are very good. A must visit restaurant",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const business = await businessFunctions.getBusinessByName("Hoboken Park");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("rajpatel");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      3,
      "The park is very good. The park is very clean and the equipments are very good. A must visit park",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const business = await businessFunctions.getBusinessByName("Chipotle");
    const businessId = business._id.toString();
    const categoryId = business.categoryId.toString();
    const user = await userFunctions.getUserByUsername("rajpatel");
    const userId = user[0]._id.toString();

    const review = await reviewFunctions.createReview(
      businessId,
      userId,
      categoryId,
      5,
      "Best burrito bowl in town. The staff is very good and the equipments are very good. A must visit restaurant",
    );
    if (review.insertedReview) {
      console.log("Review seeded");
    } else {
      console.log("Review not seeded");
    }
  } catch (error) {
    console.log(error);
  }
};
