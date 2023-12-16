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
    let usernameVal = await routeHelper.routeValidationHelper(helper.checkString,userInfo.usernameInput,"username",1,25)
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
      usernameDef:usernameVal[0],
      usernameErr:usernameVal[1],
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

    if (firstNameVal[1]||lastNameVal[1]||usernameVal[1]||sexVal[1]||ageVal[1]||contactEmailVal[1]
      ||passwordVal[1]||confirmedPasswordVal[1]||locationVal[1]){
      errorCode=400
      return res.status(400).render("register",dataToRender)
    }

    try {
      let registeredInfo=await userData.createUser(usernameVal[0],firstNameVal[0],lastNameVal[0],sexVal[0],
        ageVal[0],contactEmailVal[0],passwordVal[0],locationVal[0])
      if (registeredInfo.insertedUser){
        return res.render("login")
      }else{
        return res.statusMessage(500).render("error",{errorMessage:"Internal Server Error"})
      }
    } catch (error) {
      return res.status(400).render("register",dataToRender)
    }

  });

usersRouter
  .route("/login")
  .get(async (req, res) => {
    return res.render("login")
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
      if (loginInfo.firstName){//TODO: Hey dont return password here
        let userDetail=await userData.getUserByEmailAddress(loginInfo.contactEmail)
        req.session.user= {firstName: loginInfo.firstName, contactEmail: loginInfo.contactEmail,userId:userDetail._id}
           //https://stackoverflow.com/questions/52083218/i-want-to-redirect-to-different-pages-based-on-some-condition
           res.cookie('username',userDetail.username,{maxAge: 3600000})
           return res.redirect("home")
       
      }else{
        return res.statusMessage(500).render("error",{errorMessage:"Internal Server Error"})
      }
    } catch (error) {
      dataToRender.loginError="emailId/Password is Incorrect"
      return res.status(400).render("login",dataToRender)
    }
  });

  usersRouter
  .route('/getUser/:id').get(async (req, res) => {
      let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,req.params.id)
      if (userId[1])
        {return res.status(400)
          .json({errorMessage:"Invalid ObjectId"})} 
      try {
        let getUserInfo=await userData.getUserById(userId[0])
        return res.json(getUserInfo)
      } catch (error) {
        return res.status(400)
        .json({errorMessage:"User Not Found"})
      }
    });

    usersRouter
  .route('/deleteUser/:id').get(async (req, res) => {
      let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,req.params.id)
      if (userId[1])
        {return res.status(400)
          .json({errorMessage:"Invalid ObjectId"})} 
      try {
        let deleted=await userData.deleteUser(userId[0])
        return res.json({deleted})
      } catch (error) {
        return res.status(400)
        .json({errorMessage:"User Not Found"})
      }
    });
    //comment updateUser vs updateProfile
    usersRouter
    .route('/updateUser')
    .get(async (req, res) => {
      let userId;
      try {
        userId=helper.checkObjectId(req.session.user.userId)
      } catch (error) {
        return res.status(400)
        .render("error",{errorMessage:"User Not Found"})
      }
      let getUserInfo;
      try {
        getUserInfo=await userData.getUserById(userId)
      }
      catch (error) {
        return res.status(400)
        .render("error",{errorMessage:"User Not Found"})
      }
      let dataToRender={ 
        usernameDef:getUserInfo.username,
        firstNameDef:getUserInfo.firstName,
        lastNameDef:getUserInfo.lastName,
        sexDef:getUserInfo.sex,
        ageDef:getUserInfo.age,
        contactEmailDef:getUserInfo.contactEmail,
        locationDef:getUserInfo.location
      }
      return res.render("updateUser",dataToRender)
  
    })
    .post(async (req, res) => {
      let userInfo=req.body;
      if (!userInfo || Object.keys(userInfo).length === 0) {
        return res
          .status(400)
          .json({error: 'There are no fields in the request body'
        });
      }  
      if (!req.session.user){
        return res.status(400).render("error",{errorMessage:"User Not Found"})
      }



      let userId=req.session.user.userId
      let username = await routeHelper.routeValidationHelper(helper.checkString,userInfo.usernameInput,"username",1,25)
      let firstNameVal= await routeHelper.routeValidationHelper(helper.checkString,userInfo.firstNameInput,"firstName",1,25)
      let lastNameVal=await routeHelper.routeValidationHelper(helper.checkString,userInfo.lastNameInput,"lastName",1,25)
      let sexVal=await routeHelper.routeValidationHelper(helper.checkSex,userInfo.sexInput,"sex")
      let contactEmailVal=await routeHelper.routeValidationHelper(helper.checkValidEmail,userInfo.contactEmailInput)
      let ageVal=await routeHelper.routeValidationHelper(helper.checkAge,userInfo.ageInput,12,105)
      let passwordVal=await routeHelper.routeValidationHelper(helper.checkPass,userInfo.passwordInput)
      let confirmedPasswordVal=await routeHelper.routeValidationHelper(helper.checkSamePass,userInfo.passwordInput,userInfo.confirmPasswordInput)
      let locationVal=await routeHelper.routeValidationHelper(helper.checkAddress,userInfo.locationInput)

      let errorCode=undefined
      
      let dataToRender={
        usernameDef:username[0],
        usernameErr:username[1],
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
      };
      if (username[1]||firstNameVal[1]||lastNameVal[1]||sexVal[1]||ageVal[1]||contactEmailVal[1]
        ||passwordVal[1]||confirmedPasswordVal[1]||locationVal[1]){
        errorCode=400
        return res.status(400).render("updateUser",dataToRender)
      }

      try {
        let updatedInfo=await userData.updateUser(userId,username[0],firstNameVal[0],lastNameVal[0],sexVal[0],
          ageVal[0],contactEmailVal[0],passwordVal[0],locationVal[0])
        if (updatedInfo){
          return res.redirect("home")
        }else{
          return res.status(500).render("error",{errorMessage:"Internal Server Error"})
        }
      }catch (error) {
        return res.status(400).render("updateUser",dataToRender)
      } 
    }
  );

  usersRouter
  .route("/getAllUsers")
  .get(async (req, res) => {
    let getAllUsersInfo=await userData.getAllUsers()
    return res.json(getAllUsersInfo)
  })
    
  // usersRouter
  // .route("/getByUserName/:username")
  // .get(async (req, res) => {
  //   let username=await routeHelper.routeValidationHelper(helper.checkString,req.params.username,"username",1,25)
  //   if (username[1]){
  //     return res.status(400)
  //     .json({errorMessage:"Invalid Username"})
  //   }else{
  //     try {
  //       let getUserInfo=await userData.getUserByUsername(username[0])[0]
  //       return res.json(getUserInfo)
  //     } catch (error) {
  //       return res.status(400)
  //       .json({errorMessage:"User Not Found"})
  //     }
  //   }
  // })

  // usersRouter
  // .route("/addFollowing").post(async (req, res) => {
  //   let taskInfo=req.body;
  //   if (!taskInfo || Object.keys(taskInfo).length === 0) {
  //     return res
  //       .status(400)
  //       .json({error: 'There are no fields in the request body'});
  //   }
  //   let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
  //   let followingId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.followingIdInput)

  //   let errorCode=undefined
    
  //   if (userId[1]||followingId[1]){
  //     errorCode=400
  //     return res.status(400).json({errorMessage:"Invalid ObjectId"})
  //   }

  //   try {
  //     let addedFollowing=await userData.addFollowing(userId[0],followingId[0])
  //     if (addedFollowing.modifiedCount){
  //       return res.json({addedFollowing})
  //     }else{
  //       return res.status(500).json({errorMessage:"Internal Server Error"})
  //     }
  //   }catch (error) {
  //     return res.status(400).json({errorMessage:"Cannot add following"})
  //   }
  // })

  // usersRouter
  // .route("/removeFollowing").post(async (req, res) => {
  //   let taskInfo=req.body;
  //   if (!taskInfo || Object.keys(taskInfo).length === 0) {
  //     return res
  //       .status(400)
  //       .json({error: 'There are no fields in the request body'});
  //   }
  //   let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
  //   let followingId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.followingIdInput)

  //   let errorCode=undefined
    
  //   if (userId[1]||followingId[1]){
  //     errorCode=400
  //     return res.status(400).json({errorMessage:"Invalid ObjectId"})
  //   }

  //   try {
  //     let removeFollowing=await userData.removeFollowing(userId[0],followingId[0])
  //     if (removeFollowing.modifiedCount){
  //       return res.json({removeFollowing})
  //     }else{
  //       return res.status(500).json({errorMessage:"Internal Server Error"})
  //     }
  //   }catch (error) {
  //     return res.status(400).json({errorMessage:"Cannot remove following"})
  //   }
  // })
  usersRouter
  .route("/addFollowerByUsername").post(async (req, res) => {

    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
      }
    let username=await routeHelper.routeValidationHelper(helper.checkString,taskInfo.userUsername,"username",1,25)
    let followerUsername=await routeHelper.routeValidationHelper(helper.checkString,taskInfo.adminUsername,"adminUsername",1,25)
    
    let errorCode=undefined

    if (username[1]||followerUsername[1]){
      errorCode=400
      return res.status(400).json({errorMessage:"Invalid Username"})
    }

    try {
      let addedFollower=await userData.addFollowerByUserName(username[0],followerUsername[0])
      // let addedFollowing=await userData.addFollowingByUserName(followerUsername[0],username[0])
      if (addedFollower){//&&addedFollowing.modifiedCount){ 
        return res.json({addedFollower})
      }else{
        return res.status(500).json({errorMessage:"Internal Server Error"})
      }
    }catch (error) {
      return res.status(400).json({errorMessage:"Cannot add follower"})
    }
  }
  );

  usersRouter
  .route("/addFollower").post(async (req, res) => {

    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
      }
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
    let followerId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.followerIdInput)
    
    let errorCode=undefined

    if (userId[1]||followerId[1]){
      errorCode=400
      return res.status(400).json({errorMessage:"Invalid ObjectId"})
    }
    
    try {
      let addedFollower=await userData.addFollower(userId[0],followerId[0])
      let addedFollowing=await userData.addFollowing(followerId[0],userId[0])
      if (addedFollower.modifiedCount && addedFollowing.modifiedCount){
        return res.json({addedFollower})
      }else{
        return res.status(500).json({errorMessage:"Internal Server Error"})
      }
    }catch (error) {
      return res.status(400).json({errorMessage:"Cannot add follower"})
    }
  }
  )

  usersRouter
  .route("/removeFollower").post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
    let followerId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.followerIdInput)

    let errorCode=undefined
    
    if (userId[1]||followerId[1]){
      errorCode=400
      return res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let removeFollower=await userData.removeFollower(userId[0],followerId[0])
      if (removeFollower.modifiedCount){
        return res.json({removeFollower})
      }else{
        return res.status(500).json({errorMessage:"Internal Server Error"})
      }
    }catch (error) {
      return res.status(400).json({errorMessage:"Cannot remove follower"})
    }
  }
  )

  usersRouter
  .route("/addTags").post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
    let tag=await routeHelper.routeValidationHelper(helper.checkString,taskInfo.tagInput,"tag",1,25)

    let errorCode=undefined
    
    if (userId[1]||tag[1]){
      errorCode=400
      return res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let addedTag=await userData.addTags(userId[0],tag[0])
      if (addedTag.modifiedCount){
        return res.json({addedTag})
      }else{
        return res.status(500).json({errorMessage:"Internal Server Error"})
      }
    }catch (error) {
      return res.status(400).json({errorMessage:"Cannot add tag"})
    }
  })

  usersRouter
  .route("/removeTags").post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
    let tag=await routeHelper.routeValidationHelper(helper.checkString,taskInfo.tagInput,"tag",1,25)

    let errorCode=undefined
    
    if (userId[1]||tag[1]){
      errorCode=400
      return res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let removeTag=await userData.removeTags(userId[0],tag[0])
      if (removeTag.modifiedCount){
        res.json({removeTag})
      }else{
        return res.status(500).json({errorMessage:"Internal Server Error"})
      }
    }catch (error) {
      return res.status(400).json({errorMessage:"Cannot remove tag"})
    }
  })

  usersRouter
  .route("/addReview").post(async (req, res) => {
    let taskInfo=req.body;
    if (!taskInfo || Object.keys(taskInfo).length === 0) {
      return res
        .status(400)
        .json({error: 'There are no fields in the request body'});
    }
    let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
    let reviewId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.reviewIdInput)

    let errorCode=undefined
    
    if (userId[1]||reviewId[1]){
      errorCode=400
      return res.status(400).json({errorMessage:"Invalid ObjectId"})
    }

    try {
      let addedReview=await userData.addReview(userId[0],reviewId[0])
      if (addedReview.modifiedCount){
        return res.json({addedReview})
      }else{
        return res.status(500).json({errorMessage:"Internal Server Error"})
      }
    }catch (error) {
      return res.status(400).json({errorMessage:"Cannot add review"})
    }
  })

    usersRouter.route("/removeReview").post(async (req, res) => {
      let taskInfo=req.body;
      if (!taskInfo || Object.keys(taskInfo).length === 0) {
        return res
          .status(400)
          .json({error: 'There are no fields in the request body'});
      }
      let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
      let reviewId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.reviewIdInput)
  
      let errorCode=undefined
      
      if (userId[1]||reviewId[1]){
        errorCode=400
        return res.status(400).json({errorMessage:"Invalid ObjectId"})
      }
  
      try {
        let removeReview=await userData.removeReview(userId[0],reviewId[0])
        if (removeReview.modifiedCount){
          return res.json({removeReview})
        }else{
          return res.status(500).json({errorMessage:"Internal Server Error"})
        }
      }catch (error) {
        return res.status(400).json({errorMessage:"Cannot remove review"})
      }
    })

    usersRouter.route("/addComment").post(async (req, res) => {
      let taskInfo=req.body;
      if (!taskInfo || Object.keys(taskInfo).length === 0) {
        return res
          .status(400)
          .json({error: 'There are no fields in the request body'});
      }
      let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
      let commentId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.commentIdInput)
  
      let errorCode=undefined
      
      if (userId[1]||commentId[1]){
        errorCode=400
        return res.status(400).json({errorMessage:"Invalid ObjectId"})
      }
  
      try {
        let addedComment=await userData.addComment(userId[0],commentId[0])
        if (addedComment.modifiedCount){
          return res.json({addedComment})
        }else{
          return res.status(500).json({errorMessage:"Internal Server Error"})
        }
      }catch (error) {
        return res.status(400).json({errorMessage:"Cannot add comment"})
      }
    })

    usersRouter.route("/removeComment").post(async (req, res) => {
      let taskInfo=req.body;
      if (!taskInfo || Object.keys(taskInfo).length === 0) {
        return res
          .status(400)
          .json({error: 'There are no fields in the request body'});
      }
      let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
      let commentId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.commentIdInput)
  
      let errorCode=undefined
      
      if (userId[1]||commentId[1]){
        errorCode=400
        return res.status(400).json({errorMessage:"Invalid ObjectId"})
      }
  
      try {
        let removeComment=await userData.deleteComment(userId[0],commentId[0])
        if (removeComment.modifiedCount){
          return res.json({removeComment})
        }else{
          return res.status(500).json({errorMessage:"Internal Server Error"})
        }
      }catch (error) {
        return res.status(400).json({errorMessage:"Cannot delete comment"})
      }
    })
    usersRouter
    .route("/getUsersByPrefix")
    .get(async (req, res) => {
        let userNamePrefix = req.query.prefix;
        let errorCode=undefined;
        let prefix=await routeHelper.routeValidationHelper(helper.checkString,userNamePrefix, "Prefix", 1, 50);
        if (prefix[1]){
            errorCode=400;
            return res.status(errorCode).json({errorMessage: "Bad Request"});  
        }
        try {
            let userList = await userData.getAllUserWithPrefix(prefix[0]);
            if (userList.length>0){
                return res.json(userList);
            }else{
                errorCode=404;
                return res.status(errorCode).json({errorMessage: "Not Found"});  
            }
        } catch (error) {
            errorCode=500;
            return res.status(errorCode).json({errorMessage: "Internal Server Error"});  
            
        }
    });

    usersRouter
    .route("/getUserDetails/:username")
    .get(async (req, res) => {
      let username = req.params.username;
      let errorCode=undefined;
      username=await routeHelper.routeValidationHelper(helper.checkString,username, "Username", 1, 50);
      if (username[1]){
          errorCode=400;
          return res.status(errorCode).json({errorMessage: "Bad Request"});  
      }
      try {
          let user = await userData.getUserByUsername(username[0]);
          if (user[0]){
              return res.json(user[0]);
          }else{
              errorCode=404;
              return res.status(errorCode).json({errorMessage: "Not Found"});  
          }
      } catch (error) {
          errorCode=500;
          return res.status(errorCode).json({errorMessage: "Internal Server Error"});  
          
      }
  }
  );

  usersRouter
    .route("/renderUserDetails/:username")
    .get(async (req, res) => {
      let username = req.params.username;
      let errorCode=undefined;
      username=await routeHelper.routeValidationHelper(helper.checkString,username, "Username", 1, 50);
      if (username[1]){
          errorCode=400;
          return res.status(errorCode).json({errorMessage: "Bad Request"});  
      }
      try {
          let user = await userData.getUserByUsername(username[0]);
          if (user[0]){
              return res.render("partials/userDetail",{user:user[0],adminUser:req.session.user});
          }else{
              errorCode=404;
              return res.status(errorCode).json({errorMessage: "Not Found"});  
          }
      } catch (error) {
          errorCode=500;
          return res.status(errorCode).json({errorMessage: "Internal Server Error"});  
          
      }
  }
  );




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

  usersRouter.route("/home").get(async (req, res) => {
    // let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
    // if (userId[1]){
    //   errorCode=400
    //   return res.status(400).json({errorMessage:"Invalid ObjectId"})
    // }
    try {
      let existingUserId=undefined;
      if (req.session.user){
        existingUserId=req.session.user.userId
      }
      try{
        existingUserId=helper.checkObjectId(existingUserId)
      }
      catch(error){
        return res.redirect("login")

      }
      let getUserHomeDetails = await userData.getHomePageDetails(existingUserId);
      res.render("home", {
        layout: "main",
        followingUsers: getUserHomeDetails.followingUsername,
        reviews: getUserHomeDetails.reviewsByFollowing,
        username: getUserHomeDetails.username,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  });

  usersRouter.route("/getCreateReviewPage").get(async (req, res) => {
    // let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
    // if (userId[1]){
    //   errorCode=400
    //   return res.status(400).json({errorMessage:"Invalid ObjectId"})
    // }
    try {
      // let existingUserId=undefined;
      // if (req.session.user){
      //   existingUserId=req.session.user.userId
      // }
      // try{
      //   existingUserId=helper.checkObjectId(existingUserId)
      // }
      // catch(error){
      //   return res.redirect("login")

      // }
      // let getUserHomeDetails = await userData.getHomePageDetails(existingUserId);
      res.render("createReviewPage", {
        layout: "main"
        // followingUsers: getUserHomeDetails.followingUsername,
        // reviews: getUserHomeDetails.reviewsByFollowing,
        // username: getUserHomeDetails.username,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  });

  usersRouter.route("/getUserProfilePage/:username").get(async (req, res) => {
    // let userId=await routeHelper.routeValidationHelper(helper.checkObjectId,taskInfo.userIdInput)
    // if (userId[1]){
    //   errorCode=400
    //   return res.status(400).json({errorMessage:"Invalid ObjectId"})
    // }
    const username= req.params.username;
    
    try {
      let existingUserId=undefined;
      if (req.session.user){
        existingUserId=req.session.user.userId
      }
      try{
        existingUserId=helper.checkObjectId(existingUserId)
      }
      catch(error){
        return res.redirect("login")

      }
      let getUserHomeDetails = await userData.getHomePageDetails(existingUserId);
      
      res.render("userProfilePage", {
        layout: "main",
        targetUsername: username,
        followingUsers: getUserHomeDetails.followingUsername,
        reviews: getUserHomeDetails.reviewsByFollowing,
        userProfileFull: getUserHomeDetails.username,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  });

  usersRouter.route('/logout').get(async (req, res) => {
    req.session.destroy(); 
    res.clearCookie("AuthState");
    res.render("login");
  
  });

export default usersRouter;
