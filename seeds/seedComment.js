import * as reviewFunction from "../data/review.js";
import * as userFunction from "../data/users.js";
import * as commentFunction from "../data/comments.js";

export const seedAllComment = async () => {
  const getReview = await reviewFunction.getAllReviews();
  const getUser = await userFunction.getAllUsers();
  try {
    const testUser = getUser[0]._id.toString();
    const testReview = getReview[0]._id.toString();

    const testComment = await commentFunction.createComment(
      testReview,
      testUser,
      "I agree with the review posted."
    );
    if (testComment.insertedComment) {
      console.log("Comment seeded");
    } else {
      console.log("Comment not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const testUser = getUser[1]._id.toString();
    const testReview = getReview[1]._id.toString();

    const testComment = await commentFunction.createComment(
      testReview,
      testUser,
      "I completely agree with the review posted."
    );
    if (testComment.insertedComment) {
      console.log("Comment seeded");
    } else {
      console.log("Comment not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const testUser = getUser[2]._id.toString();
    const testReview = getReview[2]._id.toString();

    const testComment = await commentFunction.createComment(
      testReview,
      testUser,
      "What Non-sense review is this?"
    );
    if (testComment.insertedComment) {
      console.log("Comment seeded");
    } else {
      console.log("Comment not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const testUser = getUser[3]._id.toString();
    const testReview = getReview[3]._id.toString();

    const testComment = await commentFunction.createComment(
      testReview,
      testUser,
      "I mean okay review but I don't agree with it completely."
    );
    if (testComment.insertedComment) {
      console.log("Comment seeded");
    } else {
      console.log("Comment not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const testUser = getUser[4]._id.toString();
    const testReview = getReview[4]._id.toString();

    const testComment = await commentFunction.createComment(
      testReview,
      testUser,
      "Sure, whatever you say."
    );
    if (testComment.insertedComment) {
      console.log("Comment seeded");
    } else {
      console.log("Comment not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const testUser = getUser[5]._id.toString();
    const testReview = getReview[5]._id.toString();

    const testComment = await commentFunction.createComment(
      testReview,
      testUser,
      "I agree with the review posted."
    );
    if (testComment.insertedComment) {
      console.log("Comment seeded");
    } else {
      console.log("Comment not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const testUser = getUser[6]._id.toString();
    const testReview = getReview[6]._id.toString();

    const testComment = await commentFunction.createComment(
      testReview,
      testUser,
      "Really? I don't think so."
    );
    if (testComment.insertedComment) {
      console.log("Comment seeded");
    } else {
      console.log("Comment not seeded");
    }
  } catch (error) {
    throw error;
  }
  try {
    const testUser = getUser[0]._id.toString();
    const testReview = getReview[7]._id.toString();

    const testComment = await commentFunction.createComment(
      testReview,
      testUser,
      "Ofcourse, I agree with the review posted."
    );
    if (testComment.insertedComment) {
      console.log("Comment seeded");
    } else {
      console.log("Comment not seeded");
    }
  } catch (error) {
    throw error;
  }
};
