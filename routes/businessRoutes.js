import express from "express";
import * as businessData from "../data/business.js";
import * as helper from "../helpers/validation.js";
import * as routeHelper from "../helpers/routeHelper.js";
import * as categoryData from "../data/category.js";
import xss from "xss";
const businessRouter = express.Router();

businessRouter
  .route("/business/createBusiness")
  .get(async (req, res) => {
    const categories = await categoryData.getAllCategory();
    return res.render("createBusiness", { categories: categories });
  })
  .post(async (req, res) => {
    let businessInfo = req.body;
    var location = {
      firstLine: xss(businessInfo.firstAddressLine),
      lastLine: xss(businessInfo.lastAddressLine),
      city: xss(businessInfo.city),
      state: xss(businessInfo.state),
      zip: xss(businessInfo.zip),
      country: xss(businessInfo.country),
    };
    let errorCode = undefined;
    try {
        businessInfo.businessName = helper.checkString(businessInfo.businessName, "Business Name", 2, 100);
        businessInfo.categoryId = helper.checkObjectId(businessInfo.categoryId);
        location = helper.checkAddress(location);
    } catch (error) {
      return res.status(400).json({ errorMessage: error });
    }

    // let businessNameVal= await routeHelper.routeValidationHelper(helper.checkString,businessInfo.businessName, "Business Name", 1, 100);
    // var location = {
    //     firstLine: businessInfo.firstAddressLine,
    //     lastLine: businessInfo.lastAddressLine,
    //     city: businessInfo.city,
    //     state: businessInfo.state,
    //     zip: businessInfo.zip,
    //     country: businessInfo.country
    // }
    // let locationVal= await routeHelper.routeValidationHelper(helper.checkAddress,location, "Location");
    // let categoryIdVal= await routeHelper.routeValidationHelper(helper.checkObjectId,businessInfo.categoryId);
    // let errorCode=undefined;

    // let dataToRender={
    //     businessNameDef:businessNameVal[0],
    //     businessNameErr:businessNameVal[1],
    //     locationDef:locationVal[0],
    //     locationErr:locationVal[1]
    // }

    // if (businessNameVal[1] || locationVal[1] ||categoryIdVal[1]){
    //     errorCode=400;
    //     return res.status(errorCode).render("createBusiness",dataToRender);
    // }

    try {
      console.log(businessInfo.businessName, businessInfo.categoryId);

      let business = await businessData.createBusiness(
        businessInfo.businessName,
        businessInfo.categoryId,
        location
      );
      if (business) {
        return res.redirect("/review/createReview");
      } else {
        errorCode = 404;
        return res.status(errorCode).render("createBusiness", dataToRender);
      }
    } catch (error) {
      errorCode = 500;
      return res
        .status(errorCode)
        .json({ errorMessage: "Internal Server Error" });
    }
  });

businessRouter.route("/business/getBusiness/:pre").get(async (req, res) => {
  let businessIdPrefix = xss(req.params.pre);
  let errorCode = undefined;
  let prefix = await routeHelper.routeValidationHelper(
    helper.checkString,
    businessIdPrefix,
    "Prefix",
    1,
    50
  );
  if (prefix[1]) {
    errorCode = 400;
    return res.status(errorCode).json({ errorMessage: "Bad Request" });
  }
  try {
    let business = await businessData.getAllBusinessWithPrefix(prefix[0]);
    if (business) {
      return res.json(business);
    } else {
      errorCode = 404;
      return res.status(errorCode).json({ errorMessage: "Not Found" });
    }
  } catch (error) {
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

businessRouter
  .route("/business/getBusinessByName/:name")
  .get(async (req, res) => {
    let businessName = xss(req.params.name);
    let errorCode = undefined;
    let name = await routeHelper.routeValidationHelper(
      helper.checkString,
      businessName,
      "Business Name",
      3,
      50
    );
    if (name[1]) {
      errorCode = 400;
      return res.status(errorCode).json({ errorMessage: "Bad Request" });
    }
    try {
      let business = await businessData.getBusinessByName(name[0]);
      if (business) {
        return res.json(business);
      } else {
        errorCode = 404;
        return res.status(errorCode).json({ errorMessage: "Not Found" });
      }
    } catch (error) {
      errorCode = 500;
      return res
        .status(errorCode)
        .json({ errorMessage: "Internal Server Error" });
    }
  });

businessRouter.route("/business/deleteBusiness/:id").get(async (req, res) => {
  let businessId = xss(req.params.id);
  let errorCode = undefined;
  businessId = routeHelper.routeValidationHelper(
    helper.checkObjectId,
    businessId
  );
  if (businessId[1]) {
    errorCode = 400;
    return res.status(errorCode).json({ errorMessage: "Bad Request" });
  }
  try {
    let deleted = await businessData.deleteBusiness(businessId[0]);
    if (deleted) {
      return res.json(deleted);
    } else {
      errorCode = 404;
      return res.status(errorCode).json({ errorMessage: "Business Not Found" });
    }
  } catch (error) {
    errorCode = 500;
    return res
      .status(errorCode)
      .json({ errorMessage: "Internal Server Error" });
  }
});

businessRouter.get("/businesses/:categoryId", async (req, res) => {
  const businesses = await businessData.getBusinessesByCategory(
    xss(req.params.categoryId)
  );
  res.json(businesses);
});

businessRouter
.get('/businesses/:categoryId', async (req, res) => {
    const businesses = await businessData.getBusinessesByCategory(xss(req.params.categoryId));
    res.json(businesses);
});

businessRouter
.get('/business/:id', async (req, res) => {
    const business = await businessData.getBusinessById(xss(req.params.id));
    res.json(business);
});

businessRouter
.route("/getBusinessRanking")
.post(async (req, res) => {
    // const taskInfo = {
    //     category: $('#categorySelect').val(),
    //     gender: {
    //         male: $('#maleCheckbox').is(':checked'),
    //         female: $('#femaleCheckbox').is(':checked')
    //     },
    //     ageRange: {
    //         min: $('#minAge').val(),
    //         max: $('#maxAge').val()
    //     }
    // };
    let taskInfo = req.body;
    let businessList = await businessData.getBusinessRankingList(taskInfo);
    return res.json({bList: businessList});
}
);



export default businessRouter;
