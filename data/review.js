import * as helper from "../helpers/validation.js";
import {
  reviews,
  users,
  businesses,
  categories,
  comments,
} from "../config/mongoCollections.js";
import fs from "fs";
import * as userData from "../data/users.js";
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
//Route linked to this function: POST /review/createReview
export const createReview = async (
  businessId,
  userId,
  categoryId,
  ratingPoints,
  reviewText,
  imagePath
) => {
  try {
    businessId = new ObjectId(helper.checkObjectId(businessId));
    userId = new ObjectId(helper.checkObjectId(userId));
    ratingPoints = helper.checkRating(ratingPoints, 1, 5);
    categoryId = new ObjectId(helper.checkObjectId(categoryId));
    reviewText = helper.checkString(reviewText, "Review Text", 1, 500);

    const businessCollection = await businesses();
    const business = await businessCollection.findOne({ _id: businessId });
    if (!business) throw "Business not found";

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";

    const categoryCollection = await categories();
    const category = await categoryCollection.findOne({ _id: categoryId });
    if (!category) throw "Category not found";

    const reviewCollection = await reviews();
    const newReview = await reviewCollection.insertOne({
      businessId: businessId,
      userId: userId,
      categoryId: categoryId,
      rating: ratingPoints,
      reviewText: reviewText,
      images: imagePath ? imagePath : null,
      comments: [],
      thumsUp: [],
      thumsDown: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    if(newReview.insertedId){
      await businessCollection.updateOne(
        { _id: businessId },
        { $addToSet: { reviews: newReview.insertedId } }
      );
      await userCollection.updateOne(
        { _id: userId },
        { $addToSet: { reviews: newReview.insertedId } }
      );
    }
    return { insertedReview: newReview.insertedId ? true : false };
  } catch (error) {}
};

export const deleteReview = async (reviewId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const businessCollection = await businesses();
    const userCollection = await users();
    await businessCollection.updateOne(
      { _id: review.businessId.toString() },
      { $pull: { reviews: reviewId } }
    );
    await userCollection.updateOne(
      { _id: review.userId.toString() },
      { $pull: { reviews: reviewId } }
    );
    const deletionInfo = await reviewCollection.deleteOne({ _id: reviewId });
    if (deletionInfo.deletedCount === 0) throw "Could not delete review";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route linked to this function: POST /review/updateReview
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
    // let imageBinary;
    // if (imagePath && imagePath.trim() !== "") {
    //   const imageBuffer = fs.readFileSync(imagePath);
    //   imageBinary = new Binary(imageBuffer);
    // } else {
    //   imageBinary = null;
    // }
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const updatedReview = await reviewCollection.updateOne(
      { _id: reviewId },
      {
        $set: {
          rating: ratingPoints,
          reviewText: reviewText,
          images: imagePath ? imagePath : null,
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



//Route linked to this function: GET /review/getReview/:id
export const getReviewById = async (reviewId) => {
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

//Route linked to this function
export const addThumbsUp = async (reviewId, userId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    userId = new ObjectId(helper.checkObjectId(userId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    await removeThumbsDown(reviewId.toString(), userId.toString());
    const updateInfo = await reviewCollection.updateOne(
      { _id: reviewId },
      { $addToSet: { thumsUp: userId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

// Route linked to this function: POST /review/removeThumbsDown
export const removeThumbsUp = async (reviewId, userId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    userId = new ObjectId(helper.checkObjectId(userId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const updateInfo = await reviewCollection.updateOne(
      { _id: reviewId },
      { $pull: { thumsUp: userId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route linked to this function: POST /review/addThumbsDown
export const addThumbsDown = async (reviewId, userId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    userId = new ObjectId(helper.checkObjectId(userId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    await removeThumbsUp(reviewId.toString(), userId.toString());
    const updateInfo = await reviewCollection.updateOne(
      { _id: reviewId },
      { $addToSet: { thumsDown: userId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route linked to this function: POST /review/removeThumbsDown
export const removeThumbsDown = async (reviewId, userId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    userId = new ObjectId(helper.checkObjectId(userId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const updateInfo = await reviewCollection.updateOne(
      { _id: reviewId },
      { $pull: { thumsDown: userId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route linked to this function: POST /review/addComment
export const addComment = async (reviewId, commentId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    commentId = new ObjectId(helper.checkObjectId(commentId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: commentId });
    if (!comment) throw "Comment not found";
    const updateInfo = await reviewCollection.updateOne(
      { _id: reviewId },
      { $addToSet: { comments: commentId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route linked to this function: POST /review/removeComment
export const removeComment = async (reviewId, commentId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    commentId = new ObjectId(helper.checkObjectId(commentId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: commentId });
    if (!comment) throw "Comment not found";
    const updateInfo = await reviewCollection.updateOne(
      { _id: reviewId },
      { $pull: { comments: commentId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route linked to this function: GET /review/getAllReviews
export const getAllReviews = async () => {
  try {
    const reviewCollection = await reviews();
    const allReviews = await reviewCollection.find({}).toArray();
    return allReviews;
  } catch (error) {
    throw error;
  }
};

export const getFeed = async (userId) => {
  var totalReviewId=[];
  const user = await userData.getUserById(userId);
  totalReviewId=totalReviewId.concat(user.reviews);
  const following = user.following;
  for (let each of following) {
    let stringId=each.toString();
    const followingUser = await userData.getUserById(stringId);
    totalReviewId=totalReviewId.concat(followingUser.reviews);
  }

  let allReviews= getAllReviewPlusName(totalReviewId);

  return allReviews;
}

export const getAllReviewPlusName = async (totalReviewId) => {
  const userCollection = await users();
  const reviewCollection = await reviews();
  const businessCollection = await businesses();
  const categoryCollection = await categories();
  const allReviews = await reviewCollection
    .find({ _id: { $in: totalReviewId } })
    .sort({ updatedAt: -1 }) // -1 for descending order
    .toArray();
  for (let each of allReviews) {
    const business = await businessCollection.findOne({ _id: each.businessId });
    const category = await categoryCollection.findOne({ _id: each.categoryId });
    const user = await userCollection.findOne({ _id: each.userId });
    each.businessName = business.name;
    each.categoryName = category.name;
    each.userName = user.firstName + " " + user.lastName;

  }
  return allReviews;
}

export const populateReviewWithData = async (allReviews) => {
  const userCollection = await users();
  const reviewCollection = await reviews();
  const businessCollection = await businesses();
  const categoryCollection = await categories();
  for (let each of allReviews) {
    const business = await businessCollection.findOne({ _id: each.businessId });
    const category = await categoryCollection.findOne({ _id: each.categoryId });
    const user = await userCollection.findOne({ _id: each.userId });
    each.businessName = business.name;
    each.categoryName = category.name;
    each.userName = user.firstName + " " + user.lastName;

  }
  return allReviews;
}

export const getReviewsByUserId = async (userId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    const reviewCollection = await reviews();
    const allReviews = await reviewCollection.find({ userId: userId }).toArray();
    return allReviews;
  } catch (error) {
    throw error;
  }
};

export const searchReview = async (condition) => {
  const reviewCollection = await reviews();
  let allReviewList = await reviewCollection
    .find({})
    .sort({ rating: -1 })
    .toArray();
  allReviewList=await populateReviewWithData(allReviewList);
  return allReviewList;
}


// export const populateAllRating = async () => {
//   const businessCollection = await businesses();
//   const allBusiness = await businessCollection.find({}).toArray();
//   try {
//     for (let each of allBusiness) {
//       populateRating(each._id.toString());
//     }
    
//   } catch (error) {
//     console.log("error in populateAllRating:",error); 
//   }



// export const populateRating = async (businessId) => {
//   businessId = new ObjectId(helper.checkObjectId(businessId));
//   const businessCollection = await businesses();
//   const reviewCollection = await reviews();


//   let reviewList=[]
//   const business = await businessCollection.findOne({ _id: businessId })
//   for (let each of business.reviews) {
//     const review = await reviewCollection.findOne({ _id: each });
//     reviewList.push(review._id);
//   }
//   let ratingVal=await calculateRating(reviewList);
//   try {
//     let updatedBusiness=await businessCollection.updateOne(
//       { _id: businessId },
//       { $set: { averageRating: ratingVal } }
//     );
//     return updatedBusiness
    
//   } catch (error) {
//     console.log(error);
//     throw error
//   }
// } 

export const getVibeReview = async (userId,businessId) => {
  userId= new ObjectId(helper.checkObjectId(userId));
  businessId= new ObjectId(helper.checkObjectId(businessId));

  const userCollection = await users();
  const reviewCollection = await reviews();
  const businessCollection = await businesses();

  const user = await userCollection.findOne({ _id: userId });
  const business = await businessCollection.findOne({ _id: businessId });


  let reviewList=[]
  for (let eachReview of business.reviews) {
    const review = await reviewCollection.findOne({ _id: eachReview });
    if (user.following.includes(review.userId)) {
      reviewList.push(review._id);
    }
  }
  let ratingVal=await calculateRating(reviewList);
  business.vibeRating=ratingVal;
  return business
}




// export const calculateRating = async (reviewList) => {
//   let ratingList=[]
//   const reviewCollection = await reviews();
//   for (let each of reviewList) {
//     var reviewId = new ObjectId(each._id);
//     var review = await reviewCollection.findOne({ _id: reviewId });
//     ratingList.push(review.rating);

//   }
//   const sum = ratingList.reduce((a, b) => a + b, 0);
//   const avg = (sum / ratingList.length) || 0;
//   let mean=  Number(avg.toFixed(1))

//   return mean
// }

export const checkIfReviewExists = async (businessId, userId) => {
  try {
    businessId = new ObjectId(helper.checkObjectId(businessId));
    userId = new ObjectId(helper.checkObjectId(userId));
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ businessId: businessId, userId: userId });
    if (!review) return false;
    return true;
  } catch (error) {
    throw error;
  }
}
