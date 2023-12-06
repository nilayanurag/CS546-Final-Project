import express from "express";
import * as userData from "../data/users.js";
import * as helper from "../helpers/validation.js";
import * as routeHelper from "../helpers/routeHelper.js";

const usersRouter = express.Router();

usersRouter
  .route("/register")
  .get(async (req, res) => {
    res.render("register")
  })
  .post(async (req, res) => {
    let userInfo=req.body;

    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let firstNameVal= await routeHelper.routeValidationHelper(helper.checkString,userInfo.firstNameInput,"firstName",1,25)
    let lastNameVal=await routeHelper.routeValidationHelper(helper.checkString,userInfo.lastNameInput,"lastName",1,25)
    let sexVal=await routeHelper.routeValidationHelper(helper.checkSex,userInfo.sexInput,"sex")
    let contactEmailVal=await routeHelper.routeValidationHelper(helper.checkIfEmailPresent,userInfo.contactEmailInput)
    let ageVal=await routeHelper.routeValidationHelper(helper.checkAge,userInfo.ageInput,12,105)
    let passwordVal=await routeHelper.routeValidationHelper(helper.checkPass,userInfo.passwordInput)
    let confirmedPasswordVal=await routeHelper.routeValidationHelper(helper.checkSamePass,userInfo.passwordInput,userInfo.confirmPasswordInput)
    let locationVal=await routeHelper.routeValidationHelper(helper.checkAddress,userInfo.locationInput)


    let errorCode=undefined
    let dataToRender={
      firstNameDef:firstNameVal[0],
      firstNameErr:firstNameVal[1],
      lastNameDef:lastNameVal[0],
      lastNameErr:lastNameVal[1],
      sexDef:sexVal[0],
      sexErr:sexVal[1],
      ageDef:ageVal[0],
      ageErr:ageVal[1],
      contactEmailDef:contactEmailVal[0],
      contactEmailErr:contactEmailVal[1],
      passwordErr:passwordVal[1],
      confirmedPasswordErr:confirmedPasswordVal[1],
      locationDef:locationVal[0],
      locationErr:locationVal[1],
    }

    if (firstNameVal[1]||lastNameVal[1]||sexVal[1]||ageVal[1]||contactEmailVal[1]
      ||passwordVal[1]||confirmedPasswordVal[1]||locationVal[1]){
      errorCode=400
      res.status(400).render("register",dataToRender)
    }

    try {
      let registeredInfo=await userData.createUser(firstNameVal[0],lastNameVal[0],sexVal[0],
        ageVal[0],contactEmailVal[0],passwordVal[0],locationVal[0])
      if (registeredInfo.insertedUser){
        res.render("login")
      }else{
        res.statusMessage(500).render("error",{errorMessage:"Internal Server Error"})
      }
    } catch (error) {
      res.status(400).render("register",dataToRender)
    }

  });

usersRouter
  .route("/login")
  .get(async (req, res) => {
    res.render("login")
  })
  .post(async (req, res) => {
    let userInfo=req.body;

    if (!userInfo || Object.keys(userInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let contactEmailVal=await routeHelper.routeValidationHelper(helper.checkValidEmail,userInfo.contactEmailInput)
    let passwordVal=await routeHelper.routeValidationHelper(helper.checkPass,userInfo.passwordInput)
    let dataToRender={
      contactEmailDef:contactEmailVal[0],
      contactEmailErr:contactEmailVal[1],
      passwordErr:passwordVal[1]
    }

    try {
      let loginInfo=await userData.loginUser(contactEmailVal[0],passwordVal[0])
      if (loginInfo.firstName){
        req.session.user= {firstName: loginInfo.firstName,
           lastName: loginInfo.lastName, emailAddress: loginInfo.emailAddress}
           //https://stackoverflow.com/questions/52083218/i-want-to-redirect-to-different-pages-based-on-some-condition
          res.redirect("admin")
       
      }else{
        res.statusMessage(500).render("error",{errorMessage:"Internal Server Error"})
      }
    } catch (error) {
      dataToRender.loginError="emailId/Password is Incorrect"
      res.status(400).render("login",dataToRender)
    }
  });

  usersRouter
.route('/admin').get(async (req, res) => {
    //code here for GET
    let dataToRender={
      firstName:req.session.user.firstName,
      lastName:req.session.user.lastName,
      currentTime:new Date().toLocaleTimeString(),
      role:req.session.user.role
    }
    res.render("admin",dataToRender)
  });

export default usersRouter;
