import express from "express";
import * as reviewData from "../data/review.js";
import * as helper from "../helpers/validation.js";
import * as routeHelper from "../helpers/routeHelper.js";
import * as categoryData from "../data/category.js";
import * as businessData from "../data/business.js";
import * as commentData from "../data/comments.js";
import * as userData from "../data/users.js";
import xss from "xss";
import multer from "multer";
import fs from "fs";

const reviewRouter = express.Router();
const upload = multer({ dest: "uploads/" });

reviewRouter.get("/review/createReview", async (req, res) => {
  const categories = await categoryData.getAllCategory();
  return res.render("createReview", {
    categories: categories,
    CannotAdd: req.query.CannotAdd,
  });
});

reviewRouter.post(
  "/review/createReview",
  upload.single("imagePath"),
  async (req, res) => {
    let reviewInfo = req.body;
    let fileType = req.file ? req.file.mimetype.split("/")[1] : null;
    let imagePathVal = req.file ? req.file.path + "." + fileType : null;
    imagePathVal = req.file ? req.file.path.replace(/\\/g, "/") : null;
    try {
      reviewInfo.categoryId = helper.checkObjectId(xss(reviewInfo.categoryId));
      reviewInfo.businessId = helper.checkObjectId(xss(reviewInfo.businessId));
      reviewInfo.reviewText = helper.checkString(
        xss(reviewInfo.reviewText),
        "Review Text",
        2,
        500
      );
      reviewInfo.ratingPoints = parseInt(reviewInfo.ratingPoints);
    } catch (error) {
      return res.status(400).json({ errorMessage: error });
    }

    try {
      let reviewExists = await reviewData.checkIfReviewExists(
        xss(reviewInfo.businessId),
        xss(req.session.user.userId)
      );
      if (reviewExists) {
        return res.redirect("/review/createReview?CannotAdd=true");
      }
      let review = await reviewData.createReview(
        xss(reviewInfo.businessId),
          xss(req.session.user.userId),
            xss(reviewInfo.categoryId),
              xss(reviewInfo.ratingPoints),
                xss(reviewInfo.reviewText),
                  xss(imagePathVal)
      );
      console.log(review);
      if (review) {
        return res.redirect("/review/getMyReview");
      }
    } catch (error) {
      return res.status(404).json({ errorMessage: error });
    }
  }
);

reviewRouter.route("/review/deleteReview/:id").post(async (req, res) => {
  let reviewIdVal = req.params.id;
  try {
    reviewIdVal = helper.checkObjectId(xss(reviewIdVal));
    reviewIdVal = xss(reviewIdVal);
  } catch (error) {
    return res.status(400).json({ errorMessage: error });
  }
  try {
    let deleted = await reviewData.deleteReview(reviewIdVal);
    if (deleted) {
      return res.redirect("/review/getMyReview");
    } else {
      errorCode = 404;
      return res.status(errorCode).json({ errorMessage: "Review not found" });
    }
  } catch (error) {
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});



reviewRouter.route("/review/updateReview/:id").get(async (req, res) => {
  const reviewId = xss(req.params.id);
  try {
    const review = await reviewData.getReviewById(reviewId);
    const business = await businessData.getBusinessById(
      review.businessId.toString()
    );
    const category = await categoryData.getCategoryById(
      review.categoryId.toString()
    );
    res.render("updateReview", {
      review: review,
      businessName: business.name,
      categoryName: category.name,
    });
  } catch (error) {
    res.status(500).render("error", { errorMessage: "Internal Server Error" });
  }
});

reviewRouter.post(
  "/review/updateReview/:id",
  upload.single("imagePath"),
  async (req, res) => {
  let reviewId = xss(req.params.id);
  let reviewInfo = req.body;
  reviewInfo.ratingPoints = parseInt(reviewInfo.ratingPoints,10);

  let fileType = req.file ? req.file.mimetype.split("/")[1] : null;
  let imagePathVal = req.file ? req.file.path + "." + fileType : null;
  imagePathVal = req.file ? req.file.path.replace(/\\/g, "/") : null;
  try {
    reviewId = helper.checkObjectId(reviewId);
    reviewId = xss(reviewId);
    reviewInfo.ratingPoints = parseInt(reviewInfo.ratingPoints,10);
    reviewInfo.reviewText = helper.checkString(reviewInfo.reviewText, "Review Text", 2, 500);
  } catch (error) {
    return res.status(400).json({ errorMessage: error });
  }
  try {
    
    let review = await reviewData.updateReview(
      reviewId,
      reviewInfo.ratingPoints,
      reviewInfo.reviewText,
      imagePathVal
    );
    if (review) {
      return res.redirect("/review/getMyReview");
    } else {
      errorCode = 404;
      return res.status(errorCode).json({ errorMessage: "Review not found" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: error });
  }
});

// Important route for get all reviews (DO NOT DELETE)
reviewRouter.route("/review/getReview/:id").get(async (req, res) => {
  let reviewIdVal = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(req.params.id)
  );
  let errorCode = undefined;
  if (reviewIdVal[1]) {
    errorCode = 400;
    return res.status(errorCode).json({ errorMessage: "Invalid ObjectId" });
  }
  try {
    let reviewInfo = await reviewData.getReviewById(reviewIdVal[0]);
    let userinfo = await userData.getUserById(reviewInfo.userId.toString());
    let businessinfo = await businessData.getBusinessById(
      reviewInfo.businessId.toString()
    );
    let commentInfo = await commentData.getCommentsByReviewId(
      reviewInfo._id.toString()
    );
    for (let i = 0; i < commentInfo.length; i++) {
      if (commentInfo[i].userId === req.session.user.userId) {
        commentInfo[i].canDelete = true;
      }
    }
    reviewInfo._id = reviewInfo._id.toString();
    if (reviewInfo) {
      return res.render("review", {
        review: reviewInfo,
        username: userinfo.username,
        loggedInUser: req.session.user.userId,
        businessName: businessinfo.name,
        commentData: commentInfo,
        likes: reviewInfo.thumsUp.length,
        dislikes: reviewInfo.thumsDown.length,
      });
    } else {
      errorCode = 404;
      return res.status(errorCode).json({ errorMessage: "Review not found" });
    }
  } catch (error) {
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

reviewRouter.route("/review/like/:id").post(async (req, res) => {
  let reviewId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(req.params.id)
  );
  let errorCode = undefined;
  if (reviewId[1]) {
    errorCode = 400;
    return res.status(errorCode).json({ errorMessage: "Invalid ObjectId" });
  }
  try {
    reviewData.addThumbsUp(reviewId[0], req.session.user.userId);
    let reviewInfo = await reviewData.getReviewById(reviewId[0]);
    const likes = reviewInfo.thumsUp.length;
    const dislikes = reviewInfo.thumsDown.length;

    res.json({ success: true, likes, dislikes });
  } catch (error) {
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

reviewRouter.route("/review/dislike/:id").post(async (req, res) => {
  let reviewId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(req.params.id)
  );
  let errorCode = undefined;
  if (reviewId[1]) {
    errorCode = 400;
    return res.status(errorCode).json({ errorMessage: "Invalid ObjectId" });
  }
  try {
    reviewData.addThumbsDown(reviewId[0], req.session.user.userId);
    let reviewInfo = await reviewData.getReviewById(reviewId[0]);
    const likes = reviewInfo.thumsUp.length;
    const dislikes = reviewInfo.thumsDown.length;

    res.json({ success: true, likes, dislikes });
  } catch (error) {
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

reviewRouter.route("/getAllReviews").get(async (req, res) => {
  let errorCode = undefined;

  try {
    let reviewList = await reviewData.getAllReviews();

    if (reviewList) {
      return res.json(reviewList);
    } else {
      errorCode = 404;
      return res.status(errorCode).json({ errorMessage: "Reviews not found" });
    }
  } catch (error) {
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

reviewRouter.route("/review/getFeed/:username").get(async (req, res) => {
  let username = xss(req.params.username);
  let errorCode = undefined;
  try {
    let user = await userData.getUserByUsername(username);
    let userId = user[0]._id.toString();
    let reviewList = await reviewData.getFeed(userId);
    if (reviewList) {
      return res.json(reviewList);
    } else {
      errorCode = 404;
      return res.status(errorCode).json({ errorMessage: "Reviews not found" });
    }
  } catch (error) {
    console.log(error);
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

reviewRouter.route("/review/addThumbsUp").post(async (req, res) => {
  let taskInfo = req.body;
  if (!taskInfo || Object.keys(taskInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  let reviewId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.reviewIdInput)
  );
  let userId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.userIdInput)
  );

  let errorCode = undefined;

  if (reviewId[1] || userId[1]) {
    errorCode = 400;
    return res.status(400).json({ errorMessage: "Invalid ObjectId" });
  }

  try {
    let addedThumbUp = await reviewData.addThumbsUp(reviewId[0], userId[0]);
    if (addedThumbUp.modifiedCount) {
      return res.json({ addedThumbUp });
    } else {
      return res.status(404).json({ errorMessage: "Cannot find review" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: "Cannot add thumb up" });
  }
});

reviewRouter.route("/review/removeThumbsUp").post(async (req, res) => {
  let taskInfo = req.body;
  if (!taskInfo || Object.keys(taskInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  let reviewId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.reviewIdInput)
  );
  let userId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.userIdInput)
  );

  let errorCode = undefined;

  if (reviewId[1] || userId[1]) {
    errorCode = 400;
    return res.status(400).json({ errorMessage: "Invalid ObjectId" });
  }

  try {
    let removedThumbUp = await reviewData.removeThumbsUp(
      reviewId[0],
      userId[0]
    );
    if (removedThumbUp.modifiedCount) {
      return res.json({ removedThumbUp });
    } else {
      return res.status(404).json({ errorMessage: "Cannot find review" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: "Cannot remove thumb up" });
  }
});

reviewRouter.route("/review/addThumbsDown").post(async (req, res) => {
  let taskInfo = req.body;
  if (!taskInfo || Object.keys(taskInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  let reviewId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.reviewIdInput)
  );
  let userId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.userIdInput)
  );

  let errorCode = undefined;

  if (reviewId[1] || userId[1]) {
    errorCode = 400;
    return res.status(400).json({ errorMessage: "Invalid ObjectId" });
  }

  try {
    let addedThumbDown = await reviewData.addThumbsDown(reviewId[0], userId[0]);
    if (addedThumbDown.modifiedCount) {
      return res.json({ addedThumbDown });
    } else {
      return res.status(404).json({ errorMessage: "Cannot find review" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: "Cannot add thumb down" });
  }
});

reviewRouter.route("/review/removeThumbsDown").post(async (req, res) => {
  let taskInfo = req.body;
  if (!taskInfo || Object.keys(taskInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  let reviewId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.reviewIdInput)
  );
  let userId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.userIdInput)
  );

  let errorCode = undefined;

  if (reviewId[1] || userId[1]) {
    errorCode = 400;
    return res.status(400).json({ errorMessage: "Invalid ObjectId" });
  }

  try {
    let removedThumbDown = await reviewData.removeThumbsDown(
      reviewId[0],
      userId[0]
    );
    if (removedThumbDown.modifiedCount) {
      return res.json({ removedThumbDown });
    } else {
      return res.status(404).json({ errorMessage: "Cannot find review" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: "Cannot remove thumb down" });
  }
});

reviewRouter.route("/review/addComment").post(async (req, res) => {
  let taskInfo = req.body;
  if (!taskInfo || Object.keys(taskInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  let reviewId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.reviewIdInput)
  );
  let commentText = await routeHelper.routeValidationHelper(
    helper.checkString,
    xss(taskInfo.commentTextInput),
    "Comment Text",
    2,
    500
  );

  let errorCode = undefined;

  if (reviewId[1] || commentText[1]) {
    errorCode = 400;
    return res.status(400).json({ errorMessage: "Invalid ObjectId" });
  }

  try {
    let addedComment = await reviewData.addComment(reviewId[0], commentText[0]);
    if (addedComment.modifiedCount) {
      return res.json({ addedComment });
    } else {
      return res.status(404).json({ errorMessage: "Cannot find review" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

reviewRouter.route("/review/removeComment").post(async (req, res) => {
  let taskInfo = req.body;
  if (!taskInfo || Object.keys(taskInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  let reviewId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.reviewIdInput)
  );
  let commentId = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(taskInfo.commentIdInput)
  );

  let errorCode = undefined;

  if (reviewId[1] || commentId[1]) {
    errorCode = 400;
    return res.status(400).json({ errorMessage: "Invalid ObjectId" });
  }

  try {
    let removedComment = await reviewData.removeComment(
      reviewId[0],
      commentId[0]
    );
    if (removedComment.modifiedCount) {
      return res.json({ removedComment });
    } else {
      return res.status(404).json({ errorMessage: "Cannot find review" });
    }
  } catch (error) {
    return res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

// Important route for get my reviews (DO NOT DELETE)
reviewRouter.route("/review/getMyReview").get(async (req, res) => {
  try {
    let reviews = [];
    let reviewInfo = await reviewData.getReviewsByUserId(
      req.session.user.userId
    );
    for (let i = 0; i < reviewInfo.length; i++) {
      let businessinfo = await businessData.getBusinessById(
        reviewInfo[i].businessId.toString()
      );
      const review = {};
      review._id = reviewInfo[i]._id;
      review.businessName = businessinfo.name;
      review.description = reviewInfo[i].reviewText;
      review.image = reviewInfo[i].images;
      review.rating = reviewInfo[i].rating;
      review.commentData = [];
      for (let j = 0; j < reviewInfo[i].comments.length; j++) {
        let commentInfo = await commentData.getCommentById(
          reviewInfo[i].comments[j].toString()
        );
        let info = {};
        info.commentDescription = commentInfo.commentDescription;
        let userinfo = await userData.getUserById(
          commentInfo.userId.toString()
        );
        info.username = userinfo.username;
        review.commentData.push(info);
      }
      reviews.push(review);
    }
    return res.render("myReview", { reviews: reviews });
  } catch (error) {
    return res.status(404).json({ errorMessage: "Cannot find review" });
  }
});

reviewRouter.route("/review/searchReview").post(async (req, res) => {
  let taskInfo = req.body;

  if (!taskInfo || Object.keys(taskInfo).length === 0) {
    return res
      .status(400)
      .json({ error: "There are no fields in the request body" });
  }
  let errorCode = undefined;
  try {
    //valdiation function
    // let searchVal = await routeHelper.routeValidationHelper(
    //   helper.checkString,
    //   taskInfo.searchInput,
    //   "Search",
    //   1,
    //   500
    // );
  } catch (error) {
    errorCode = 400;
    return res.status(errorCode).json({ errorMessage: "Incorrect Details" });
  }
  try {
    let searchResult = await reviewData.searchReview();
    if (searchResult) {
      return res.json(searchResult);
    } else {
      errorCode = 404;
      return res.status(errorCode).json({ errorMessage: "Reviews not found" });
    }
  } catch (error) {
    console.log(error);
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});



export default reviewRouter;
