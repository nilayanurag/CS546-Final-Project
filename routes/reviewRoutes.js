import express from "express";
import * as reviewData from "../data/review.js";
import * as helper from "../helpers/validation.js";
import * as routeHelper from "../helpers/routeHelper.js";

const reviewRouter = express.Router();

reviewRouter
.route("/review/createReview")
.get(async (req, res) => {
    res.render("createReview");
})
.post(async (req, res) => {
    let reviewInfo = req.body;
    let businessIdVal= await routeHelper.routeValidationHelper(helper.checkObjectId,reviewInfo.businessId);
    let userIdVal= await routeHelper.routeValidationHelper(helper.checkObjectId,reviewInfo.userId);
    let ratingPointsVal= await routeHelper.routeValidationHelper(helper.checkRating,reviewInfo.ratingPoints,1,5);
    let categoryIdVal= await routeHelper.routeValidationHelper(helper.checkObjectId,reviewInfo.categoryId);
    let reviewTextVal= await routeHelper.routeValidationHelper(helper.checkString,reviewInfo.reviewText, "Review Text", 1, 500);
    let imagePathVal= reviewInfo.imagePath
    let errorCode=undefined;

    let dataToRender={
        reviewTextDef:reviewTextVal[0],
        reviewTextErr:reviewTextVal[1]
    }

    if (reviewTextVal[1]){
        errorCode=400;
        res.status(errorCode).render("createReview",dataToRender);
    }

    try{
        let review = await reviewData.createReview(businessIdVal[0],userIdVal[0],categoryIdVal[0],ratingPointsVal[0],reviewTextVal[0],imagePathVal);
        if (review){
            res.redirect("/review/getReview/"+review._id);
        }else{
            errorCode=500;
            res.status(errorCode).render("createReview",dataToRender);
        }
    }catch(error){
        errorCode=500;
        res.status(errorCode).render("createReview",dataToRender);  
    }
});

reviewRouter
.route("/review/deleteReview/:id")
.get(async (req, res) => {
    let reviewIdVal= await routeHelper.routeValidationHelper(helper.checkObjectId,req.params.id);
    let errorCode=undefined;
    if (reviewIdVal[1]){
        errorCode=400;
        res.status(errorCode).json({errorMessage:"Invalid ObjectId"});
    }
    try{
        let deleted = await reviewData.deleteReview(reviewIdVal[0]);
        if (deleted){
            res.json({deleted});
        }else{
            errorCode=404;
            res.status(errorCode).json({errorMessage:"Review not found"});
        }
    }catch(error){
        errorCode=500;
        res.status(errorCode).json({errorMessage:"Internal Server Error"});
    }
})

reviewRouter
.route("/review/updateReview")
.post(async (req, res) => {
    let reviewInfo = req.body;
    let reviewIdVal= await routeHelper.routeValidationHelper(helper.checkObjectId,reviewInfo.reviewId);
    let ratingPointsVal= await routeHelper.routeValidationHelper(helper.checkRating,reviewInfo.ratingPoints,1,5);
    let reviewTextVal= await routeHelper.routeValidationHelper(helper.checkString,reviewInfo.reviewText, "Review Text", 1, 500);
    let imagePathVal= reviewInfo.imagePath

    let errorCode=undefined;

    let dataToRender={
        reviewTextDef:reviewTextVal[0],
        reviewTextErr:reviewTextVal[1]
    }

    if (reviewTextVal[1]){
        errorCode=400;
        res.status(errorCode).render("updateReview",dataToRender);
    }

    try{
        let updatedReview = await reviewData.updateReview(
            reviewIdVal[0],
            ratingPointsVal[0],
            reviewTextVal[0],
            imagePathVal
        );
        if (updatedReview){
            res.redirect("/review/getReview/"+review._id);
        }else{
            errorCode=404;
            res.status(errorCode).json({errorMessage:"Review not found"})   ;
        }
    }catch(error){
        errorCode=500;
        res.status(errorCode).json({errorMessage:"Internal Server Error"}); 
    }
})


reviewRouter
.route("/review/getReview/:id")
.get(async (req, res) => {
    let reviewIdVal= await routeHelper.routeValidationHelper(helper.checkObjectId,req.params.id);
    let errorCode=undefined;
    if (reviewIdVal[1]){
        errorCode=400;
        res.status(errorCode).json({errorMessage:"Invalid ObjectId"});
    }
    try{
        let reviewInfo = await reviewData.getReview(reviewIdVal[0]);
        if (reviewInfo){
            res.render("review", { review: review });
        }else{
            errorCode=404;
            res.status(errorCode).json({errorMessage:"Review not found"});
        }
    }catch(error){
        errorCode=500;
        res.status(errorCode).json({errorMessage:"Internal Server Error"});
    }
});

reviewRouter
.route("/review/getAllReviews")
.get(async (req, res) => {
    try{
        let reviewList = await reviewData.getAllReviews();
        if (reviewList){
            res.json(reviewList);
        }else{
            errorCode=404;
            res.status(errorCode).json({errorMessage:"Reviews not found"});
        }
    }catch(error){
        errorCode=500;
        res.status(errorCode).json({errorMessage:"Internal Server Error"});
    }
});

  reviewRouter
  .route("/review/addThumbsUp").post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let reviewId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.reviewIdInput)
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)

    let errorCode=undefined
    
    if (reviewId[1]||userId[1]){
      errorCode=400
      res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let addedThumbUp=await reviewData.addThumbsUp(reviewId[0],userId[0])
      if (addedThumbUp.modifiedCount){
        res.json({addedThumbUp})
      }else{
        res.status(404).json({errorMessage:"Cannot find review"})
      }
    }catch (error) {
      res.status(500).json({errorMessage:"Cannot add thumb up"})
    }
  })

  reviewRouter
  .route("/review/removeThumbsUp")
  .post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let reviewId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.reviewIdInput)
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)

    let errorCode=undefined
    
    if (reviewId[1]||userId[1]){
      errorCode=400
      res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let removedThumbUp=await reviewData.removeThumbsUp(reviewId[0],userId[0])
      if (removedThumbUp.modifiedCount){
        res.json({removedThumbUp})
      }else{
        res.status(404).json({errorMessage:"Cannot find review"})
      }
    }catch (error) {
      res.status(500).json({errorMessage:"Cannot remove thumb up"})
    }
  })

  reviewRouter
  .route("/review/addThumbsDown").post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let reviewId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.reviewIdInput)
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)

    let errorCode=undefined
    
    if (reviewId[1]||userId[1]){
      errorCode=400
      res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let addedThumbDown=await reviewData.addThumbsDown(reviewId[0],userId[0])
      if (addedThumbDown.modifiedCount){
        res.json({addedThumbDown})
      }else{
        res.status(404).json({errorMessage:"Cannot find review"})
      }
    }catch (error) {
      res.status(500).json({errorMessage:"Cannot add thumb down"})
    }
  })


  reviewRouter
  .route("/review/removeThumbsDown")
  .post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let reviewId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.reviewIdInput)
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)

    let errorCode=undefined
    
    if (reviewId[1]||userId[1]){
      errorCode=400
      res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let removedThumbDown=await reviewData.removeThumbsDown(reviewId[0],userId[0])
      if (removedThumbDown.modifiedCount){
        res.json({removedThumbDown})
      }else{
        res.status(404).json({errorMessage:"Cannot find review"})
      }
    }catch (error) {
      res.status(500).json({errorMessage:"Cannot remove thumb down"})
    }
  })

reviewRouter
.route("/review/addComment")
.post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let reviewId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.reviewIdInput)
    let commentText=await routeHelper.routeValidationHelper(helper.checkString,taskInfo.commentTextInput,"Comment Text",1,500)

    let errorCode=undefined
    
    if (reviewId[1]||commentText[1]){
      errorCode=400
      res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let addedComment=await reviewData.addComment(reviewId[0],commentText[0])
      if (addedComment.modifiedCount){
        res.json({addedComment})
      }else{
        res.status(404).json({errorMessage:"Cannot find review"})
      }
    }catch (error) {
      res.status(500).json({errorMessage:"Internal Server Error"})
    }
    })

    reviewRouter
    .route("/review/removeComment")
    .post(async (req, res) => {
        let taskInfo=req.body;
        if (!taskInfo || Object.keys(taskInfo).length === 0) {
            return res
            .status(400)
            .json({error: 'There are no fields in the request body'});
        }
        let reviewId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.reviewIdInput)
        let commentId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.commentIdInput)
    
        let errorCode=undefined
        
        if (reviewId[1]||commentId[1]){
            errorCode=400
            res.status(400).json({errorMessage:"Invalid ObjectId"})
        }
    
        try {
            let removedComment=await reviewData.removeComment(reviewId[0],commentId[0])
            if (removedComment.modifiedCount){
            res.json({removedComment})
            }else{
            res.status(404).json({errorMessage:"Cannot find review"})
            }
        }catch (error) {
            res.status(500).json({errorMessage:"Internal Server Error"})
        }
        })

        





  export default reviewRouter;





  