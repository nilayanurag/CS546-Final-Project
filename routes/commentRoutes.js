import express from "express";
import * as commentData from "../data/comments.js";
import * as helper from "../helpers/validation.js";
import * as routeHelper from "../helpers/routeHelper.js";
import * as validate from "../helpers/validation.js";
import xss from "xss";
const commentRouter = express.Router();

commentRouter.route("/comments/createComment").post(async (req, res) => {
  let commentInfo = req.body;
  try {
    commentInfo.reviewId = validate.checkObjectId(xss(commentInfo.reviewId));
    commentInfo.commentDescription = validate.checkString(
      commentInfo.commentDescription,
      "Comment Description",
      2,
      500
    );
    req.session.user.userId = validate.checkObjectId(xss(req.session.user.userId));
  } catch (error) {
    return res.status(400).json({ errorMessage: error });
  }
  let errorCode = undefined;
  try {
    let comment = await commentData.createComment(
      commentInfo.reviewId,
      req.session.user.userId,
      commentInfo.commentDescription
    );
    if (comment) {
      return res.redirect("/review/getReview/" + commentInfo.reviewId);
    } else {
      errorCode = 404;
      return res
        .status(errorCode)
        .json({ errorMessage: "Comment not created" });
    }
  } catch (error) {
    errorCode = 404;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

commentRouter.route("/comments/deleteComment/:id").post(async (req, res) => {
  let commentId = req.params.id;
  try {
    req.body.reviewId = validate.checkObjectId(xss(req.body.reviewId));
    commentId = validate.checkObjectId(commentId);
  } catch (error) {
    return res.status(400).json({ errorMessage: error });
  }
  try {
    let deleted = await commentData.deleteComment(xss(commentId));

    if (deleted) {
      return res.redirect("/review/getReview/" + xss(req.body.reviewId));
    } else {
      return res.status(404).json({ errorMessage: "Comment not found" });
    }
  } catch (e) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

commentRouter.route("/comments/getComment/:id").get(async (req, res) => {
  let commentIdVal = routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(req.params.id)
  );
  if (commentIdVal[1]) {
    return res.status(400).json({ errorMessage: "Not a valid Object" });
  }
  try {
    let comment = await commentData.getCommentById(commentIdVal[0]);
    if (!comment)
      return res.status(404).json({ errorMessage: "Comment not found" });
    else {
      res.json(comment);
    }
  } catch (e) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

commentRouter.route("/comments/updateComment").post(async (req, res) => {
  let commentInfo = req.body;
  let commentIdVal = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(commentInfo.commentId)
  );
  let reviewIdVal = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(commentInfo.reviewId)
  );
  let userIdVal = await routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(commentInfo.userId)
  );
  let commentDescriptionVal = await routeHelper.routeValidationHelper(
    helper.checkString,
    xss(commentInfo.commentDescription),
    "Comment Description",
    1,
    500
  );
  let errorCode = undefined;

  let dataToRender = {
    commentIdDef: commentIdVal[0],
    commentIdErr: commentIdVal[1],
    reviewIdDef: reviewIdVal[0],
    reviewIdErr: reviewIdVal[1],
    userIdDef: userIdVal[0],
    userIdErr: userIdVal[1],
    commentDescriptionDef: commentDescriptionVal[0],
    commentDescriptionErr: commentDescriptionVal[1],
  };

  if (
    commentIdVal[1] ||
    reviewIdVal[1] ||
    userIdVal[1] ||
    commentDescriptionVal[1]
  ) {
    errorCode = 400;
    return res.status(errorCode).render("updateComment", dataToRender);
  }

  try {
    let comment = await commentData.updateComment(
      commentIdVal[0],
      reviewIdVal[0],
      userIdVal[0],
      commentDescriptionVal[0]
    );
    if (comment) {
      return res.redirect("/comments/getComment/" + comment._id);
    } else {
      errorCode = 404;
      return res
        .status(errorCode)
        .json({ errorMessage: "Comment not updated" });
    }
  } catch (error) {
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

commentRouter.route("/comments/getAllbyId/:id").get(async (req, res) => {
  let reviewIdVal = routeHelper.routeValidationHelper(
    helper.checkObjectId,
    xss(req.params.id)
  );
  if (reviewIdVal[1]) {
    return res.status(400).json({ errorMessage: "Not a valid Object" });
  }
  try {
    let comments = await commentData.getAllCommentsByReviewId(reviewIdVal[0]);
    if (!comments)
      return res.status(404).json({ errorMessage: "Comments not found" });
    else {
      res.json(comments);
    }
  } catch (e) {
    res.status(500).json({ errorMessage: "Internal Server Error" });
  }
});

export default commentRouter;
