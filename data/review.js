import * as helper from "../helpers/validation.js";
import { reviews } from "../config/mongoCollections.js";
import fs from 'fs';
import {Binary, ObjectId} from "mongodb";

/*
reviews:{
    _id: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    businessId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    userId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    categoryId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    rating: 4,
    reviewText: “The ambience of Napoli's pizzeria was amazing and food         was delightful as well. A must visit resto”,
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
    categoryId = helper.checkObjectId(categoryId);
    reviewText = helper.checkString(reviewText, "Review Text", 1, 500);

    // validate image if there then insert else null
    let imageBinary
    if (imagePath && imagePath.trim() !== ''){
        const imageBuffer = fs.readFileSync(imagePath);
        imageBinary = new Binary(imageBuffer); 
    }else{
        imageBinary = null
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

export const deleteReview = async (reviewId) => {};

export const updateReview = async (reviewId, ratingPoints,
    reviewText,
    imagePath) => {};

export const getReview = async () => {};

export const thumbsUp = async () => {};

export const removeThumbsUp = async () => {};

export const thumbsDown = async () => {};

export const removeThumbsDown = async () => {};

export const updatedReviewTimeStamp = async () => {
  /**call after every operation */
};
