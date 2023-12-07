import express from "express";
import * as businessData from "../data/business.js";
import * as helper from "../helpers/validation.js";
import * as routeHelper from "../helpers/routeHelper.js";

const businessRouter = express.Router();


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

businessRouter
.route("/business/getBusiness/:pre")
.get(async (req, res) => {
    let businessIdPrefix = req.params.pre;
    let errorCode=undefined;
    let prefix=await routeHelper.routeValidationHelper(helper.checkString,businessIdPrefix, "Prefix", 1, 50);
    if (prefix[1]){
        errorCode=400;
        return res.status(errorCode).json({errorMessage: "Bad Request"});  
    }
    try {
        let business = await businessData.getAllBusinessWithPrefix(prefix[0]);
        if (business){
            return res.json(business);
        }else{
            errorCode=404;
            return res.status(errorCode).json({errorMessage: "Not Found"});  
        }
    } catch (error) {
        errorCode=500;
        return res.status(errorCode).json({errorMessage: "Internal Server Error"});  
        
    }
});

businessRouter
.route("/business/getBusinessByName/:name")
.get(async (req, res) => {
    let businessName = req.params.name;
    let errorCode=undefined;
    let name=await routeHelper.routeValidationHelper(helper.checkString,businessName, "Business Name", 3, 50);
    if (name[1]){
        errorCode=400;
        return res.status(errorCode).json({errorMessage: "Bad Request"});  
    }
    try {
        let business = await businessData.getBusinessByName(name[0]);
        if (business){
            return res.json(business);
        }else{
            errorCode=404;
            return res.status(errorCode).json({errorMessage: "Not Found"});  
        }
    } catch (error) {
        errorCode=500;
        return res.status(errorCode).json({errorMessage: "Internal Server Error"});  
        
    }
});

businessRouter
.route("/business/deleteBusiness/:id")
.get(async (req, res) => {
    let businessId = req.params.id;
    let errorCode=undefined;
    businessId=routeHelper.routeValidationHelper(helper.checkObjectId,businessId);
    if (businessId[1]){
        errorCode=400;
        return res.status(errorCode).json({errorMessage: "Bad Request"});  
    }
    try {
        let deleted = await businessData.deleteBusiness(businessId[0]);
        if (deleted){
            return res.json(deleted);
        }else{
            errorCode=404;
            return res.status(errorCode).json({errorMessage: "Business Not Found"});  
        }
    } catch (error) {
        errorCode=500;
        return res.status(errorCode).json({errorMessage: "Internal Server Error"});  
    }
    
});


export default businessRouter;