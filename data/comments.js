import * as helper from "../helpers/validation.js";
import { comments } from "../config/mongoCollections.js";

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
    reviewId = helper.checkObjectId(reviewId);
    userId = helper.checkObjectId(userId);
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
export const deleteComment = async (commentid) => {
  try {
    commentid = helper.checkObjectId(commentid);
    const commentCollection = await comments();
    const deleteComment = await commentCollection.deleteOne({ _id: commentid });
    return { deletedComment: deleteComment.deletedCount ? true : false };
  } catch (error) {
    throw error;
  }
};

export const getCommentById = async (commentId) => {
  try {
    commentId = helper.checkObjectId(commentId);
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
    commentId = helper.checkObjectId(commentId);
    reviewId = helper.checkObjectId(reviewId);
    userId = helper.checkObjectId(userId);
    commentDescription = helper.checkString(
      commentDescription,
      "Comment Description",
      1,
      500
    );
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
