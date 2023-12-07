import * as helper from "../helpers/validation.js";
import { reviews } from "../config/mongoCollections.js";
import fs from "fs";
import { Binary, ObjectId } from "mongodb";

/*
reviews:{
    _id: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    businessId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    userId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    categoryId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    rating: 4,
    reviewText: “The ambience of Napoli's pizzeria was amazing and food  was delightful as well. A must visit resto”,
    images: binary data,
    comments: [],
    thumsUp: [“7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,  
			“7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710”],
    thumsDown: [“7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,  
			“7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710”],
    createdAt: 2022-02-26T16:37:48.244Z,
    updatedAt: 2022-02-26T16:37:48.244Z,
},
 */

export const createReview = async (
  businessId,
  userId,
  categoryId,
  ratingPoints,
  reviewText,
  imagePath
) => {
  try {
    businessId = helper.checkObjectId(businessId);
    userId = helper.checkObjectId(userId);
    ratingPoints = helper.checkRating(ratingPoints, 1, 5);
    categoryId = helper.checkObjectId(categoryId);
    reviewText = helper.checkString(reviewText, "Review Text", 1, 500);

    // validate image if there then insert else null
    let imageBinary;
    if (imagePath && imagePath.trim() !== "") {
      const imageBuffer = fs.readFileSync(imagePath);
      imageBinary = new Binary(imageBuffer);
    } else {
      imageBinary = null;
    }

    const reviewCollection = await reviews();
    const newReview = await reviewCollection.insertOne({
      businessId: businessId,
      userId: userId,
      categoryId: categoryId,
      rating: ratingPoints,
      reviewText: reviewText,
      images: imageBinary,
      comments: [],
      thumsUp: [],
      thumsDown: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { insertedReview: newReview.insertedId ? true : false };
  } catch (error) {}
};

// MOST IMP: You are deleting any review, make sure to FIRST delete all the comments associated with it
// as well as remove the review from the business document and user document
export const deleteReview = async (reviewId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const deletionInfo = await reviewCollection.deleteOne({ _id: reviewId });
    if (deletionInfo.deletedCount === 0) throw "Could not delete review";
    return true;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (
  reviewId,
  ratingPoints,
  reviewText,
  imagePath
) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    ratingPoints = helper.checkRating(ratingPoints, 1, 5);
    reviewText = helper.checkString(reviewText, "Review Text", 1, 500);
    // validate image if there then insert else null
    let imageBinary;
    if (imagePath && imagePath.trim() !== "") {
      const imageBuffer = fs.readFileSync(imagePath);
      imageBinary = new Binary(imageBuffer);
    } else {
      imageBinary = null;
    }
    const reviewCollection = await reviews();

    const updatedReview = await reviewCollection.updateOne(
      { _id: reviewId },
      {
        $set: {
          rating: ratingPoints,
          reviewText: reviewText,
          images: imageBinary,
          updatedAt: new Date(),
        },
        
      },
      { returnDocument: "after" }
    );
    if (updatedReview.modifiedCount === 0)
      throw "Could not update review successfully";
    return true;
  } catch (error) {
    throw error;
  }
};

export const getReview = async (reviewId) => {
    try {
        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: reviewId });
        if (!review) throw "Review not found";
        return review;
    } catch (error) {
        throw error;
    }

};

export const addThumbsUp = async (reviewId, userId) => {
    try {
        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        userId = new ObjectId(helper.checkObjectId(userId));
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: reviewId });
        if (!review) throw "Review not found";
        const updateInfo = await reviewCollection.updateOne({ _id: reviewId }, { $addToSet: { thumsUp: userId }, $set: { updatedAt: new Date() } });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return true;
    } catch (error) {
        throw error;
    }
};


export const removeThumbsUp = async (reviewId, userId) => {
    try {

        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        userId = new ObjectId(helper.checkObjectId(userId));
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: reviewId });
        if (!review) throw "Review not found";
        const updateInfo = await reviewCollection.updateOne({ _id: reviewId }, { $pull: { thumsUp: userId }, $set: { updatedAt: new Date() } });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return true;
        
    } catch (error) {
        throw error;
    }
};

export const addThumbsDown = async (userId, reviewId) => {
    try {
        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        userId = new ObjectId(helper.checkObjectId(userId));
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: reviewId });
        if (!review) throw "Review not found";
        const updateInfo = await reviewCollection.updateOne({ _id: reviewId }, { $addToSet: { thumsDown: userId }, $set: { updatedAt: new Date() } });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return true;
    } catch (error) {
        throw error;
    }
};

export const removeThumbsDown = async (reviewId, userId) => {
    try {
        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        userId = new ObjectId(helper.checkObjectId(userId));
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: reviewId });
        if (!review) throw "Review not found";
        const updateInfo = await reviewCollection.updateOne({ _id: reviewId }, { $pull: { thumsDown: userId }, $set: { updatedAt: new Date() } });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return true;
        
    } catch (error) {
        throw  error;
    }
};


