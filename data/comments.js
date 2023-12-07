import * as helper from "../helpers/validation.js";
import { comments, reviews, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

/*
comment{
	_id: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
	reviewId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
	userId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
      commentDescription: “I agree with the reviews of Napoli’s Pizzeria”
      createdAt: 2022-02-26T16:37:48.244Z,
      updatedAt: 2022-02-26T16:37:48.244Z
}*/

export const createComment = async (reviewId, userId, commentDescription) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    userId = new ObjectId(helper.checkObjectId(userId));

    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";

    commentDescription = helper.checkString(
      commentDescription,
      "Comment Description",
      1,
      500
    );
    const commentCollection = await comments();
    const newComment = await commentCollection.insertOne({
      reviewId: reviewId,
      userId: userId,
      commentDescription: commentDescription,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { insertedComment: newComment.insertedId ? true : false };
  } catch (error) {
    throw error;
  }
};

// MOST ImP: You are deleting any comment, make sure to FIRST remove the comment from the review document
// and user document
export const deleteComment = async (commentId) => {
  try {
    commentId = new ObjectId(helper.checkObjectId(commentId));
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: commentId });
    if (!comment) throw "Comment not found";
    const deleteComment = await commentCollection.deleteOne({ _id: commentId });
    return { deletedComment: deleteComment.deletedCount ? true : false };
  } catch (error) {
    throw error;
  }
};

export const getCommentById = async (commentId) => {
  try {
    commentId = new ObjectId(helper.checkObjectId(commentId));
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: commentId });
    if (!comment) throw "Comment not found";
    return comment;
  } catch (error) {
    throw error;
  }
};

export const updateComment = async (
  commentId,
  reviewId,
  userId,
  commentDescription
) => {
  try {
    commentId = new ObjectId(helper.checkObjectId(commentId));
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    userId = new ObjectId(helper.checkObjectId(userId));
    commentDescription = helper.checkString(
      commentDescription,
      "Comment Description",
      1,
      500
    );
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";

    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: commentId });
    if (!comment) throw "Comment not found";
    const updateComment = await commentCollection.updateOne(
      { _id: commentId },
      {
        $set: {
          reviewId: reviewId,
          userId: userId,
          commentDescription: commentDescription,
          updatedAt: new Date(),
        },
      }
    );
    return { updatedComment: updateComment.modifiedCount ? true : false };
  } catch {
    throw error;
  }
};

export const getCommentsByReviewId  = async (reviewId) => {
  try {
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    const reviewCollection = await reviews();
    const commentCollection = await comments();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const allComments = await commentCollection
      .find({ reviewId: reviewId })
      .toArray();
    return allComments;
  } catch (error) {
    throw error;
  }
}
