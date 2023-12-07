import express from "express";
import * as businessData from "../data/business.js";
import * as helper from "../helpers/validation.js";
import * as routeHelper from "../helpers/routeHelper.js";

const businessRouter = express.Router();


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

businessRouter
.route("/business/createBusiness")
.get(async (req, res) => {
    res.render("createBusiness");
})
.post(async (req, res) => {
    let businessInfo = req.body;
    let businessNameVal= await routeHelper.routeValidationHelper(helper.checkString,businessInfo.businessName, "Business Name", 3, 50);
    let locationVal= await routeHelper.routeValidationHelper(helper.checkAddress,businessInfo.location, "Location", 3, 50);
    let categoryIdVal= await routeHelper.routeValidationHelper(helper.checkObjectId,businessInfo.categoryId);
    let errorCode=undefined;

    let dataToRender={
        businessNameDef:businessNameVal[0],
        businessNameErr:businessNameVal[1],
        locationDef:locationVal[0],
        locationErr:locationVal[1]

    }

    if (businessNameVal[1] || locationVal[1] ||categoryIdVal[1]){
        errorCode=400;
        return res.status(errorCode).render("createBusiness",dataToRender);
    }

    try{
        let business = await businessData.createBusiness(nameVal[0],locationVal[0],phoneNumberVal[0],websiteVal[0],categoryIdVal[0]);
        if (business){
            return res.redirect("/business/getBusiness/"+business._id);
        }else{
            errorCode=404;
            return res.status(errorCode).render("createBusiness",dataToRender);
        }
    }catch(error){
        errorCode=500;
        return res.status(errorCode).json({errorMessage: "Internal Server Error"});  
    }
});