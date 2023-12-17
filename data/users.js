import * as helper from "../helpers/validation.js";
import { users, reviews, comments, businesses } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";
const saltRounds = 10;
//import * as reviewFunctions from "./review.js";

/*
Refernce Schema:
users:{
    _id: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”, 
    firstName: “Jennifer”,
    lastName: “Antison”,
    sex: “female”,
    age: 30,
    contactEmail: “jen@gmail.com”,
    password: "$2a$08$XdvNkfdNIL8F8xsuIUeSbNOFgK0M0iV5HOskfVn7.PWncShU.O",
    following: [“7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,  
		    “7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710”],
    followers: [“7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,  
			“7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710”],
    tags: [veg, bearded, liquor],
    location: {
        firstLine: “538 New York Ave”,
        secondLine: “Apt 1”,
        country: “US”,
        city: “Jersey City”,
        state: “New Jersey”,
        zip: “07307”,
    },
    reviews: [7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310,  
		  7b696a2-d0f2-4g8g-h67d-7a1d4b6b6710],
    comments: [7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310, 
               7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310],
    createdAt: 2022-02-26T16:37:48.244Z,
    updatedAt: 2022-02-26T16:37:48.244Z,
}
*/

// Route has been linked to this function
export const createUser = async (
  username,
  firstName,
  lastName,
  sex,
  age,
  contactEmail,
  password,
  location
) => {
  const userCollection = await users();

  username = helper.checkString(username, "username", 1, 25);
  firstName = helper.checkString(firstName, "firstName", 1, 25);
  lastName = helper.checkString(lastName, "lastName", 1, 25);
  sex = helper.checkSex(sex);
  contactEmail = await helper.checkIfEmailPresent(contactEmail);
  age = helper.checkAge(age, 12, 105);
  password = helper.checkPass(password);
  let followers = [];
  let following = [];
  let tags = [];
  location = helper.checkAddress(location);

  const hash = await bcrypt.hash(password, saltRounds);

  let dataPacket = {
    username,
    firstName,
    lastName,
    sex,
    age,
    contactEmail,
    password: hash,
    following,
    followers,
    tags,
    location,
    reviews: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const inserted = await userCollection.insertOne(dataPacket);
  if (inserted.insertedId) {
    return { insertedUser: true };
  } else {
    throw "Could not insert user";
  }
};

// Route has been linked to this function
export const loginUser = async (contactEmail, password) => {
  contactEmail = await helper.checkValidEmail(contactEmail);
  password = helper.checkPass(password);

  const userCollection = await users();
  const found = await userCollection.findOne({ contactEmail: contactEmail });
  if (found == null) {
    throw "Either the email address or password is invalid";
  }
  let compareToPassword = false;
  try {
    compareToPassword = await bcrypt.compare(password, found.password);
  } catch (e) {
    //no op
  }
  if (compareToPassword) {
    return {
      userId: found._id.toString(),
      firstName: found.firstName,
      lastName: found.lastName,
      contactEmail: found.contactEmail,
    };
  } else {
    throw "Either the email address or password is invalid";
  }
};

// Route has been linked to this function
export const getUserById = async (userId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    return user;
  } catch (error) {
    throw error;
  }
};

// Route has been linked to this function
export const updateUser = async (
  userId,
  username,
  firstName,
  lastName,
  sex,
  age,
  contactEmail,
  password,
  location
) => {
    userId = new ObjectId(helper.checkObjectId(userId));
    username = helper.checkString(username, "username", 1, 25);
    firstName = helper.checkString(firstName, "firstName", 1, 25);
    lastName = helper.checkString(lastName, "lastName", 1, 25);
    sex = helper.checkSex(sex);
    contactEmail = helper.checkValidEmail(contactEmail);
    age = helper.checkAge(age, 12, 105);
    password = helper.checkPass(password);
    location = helper.checkAddress(location);
    const hash = await bcrypt.hash(password, saltRounds);

    const userCollection = await users();

    let userData = await userCollection
      .find(
        { _id: userId },
        { projection: { following: 1, followers: 1, tags: 1 } }
      )
      .toArray();
    if (userData.following === undefined) userData.following = [];
    if (userData.followers === undefined) userData.followers = [];
    if (userData.tags === undefined) userData.tags = [];

    if (!userData) throw "User not found";
    let dataPacket = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      sex: sex,
      age: age,
      contactEmail: contactEmail,
      password: hash,
      following: userData.following,
      followers: userData.followers,
      tags: userData.tags,
      location: location,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedUser = await userCollection.findOneAndUpdate(
      { _id: userId },
      { $set: dataPacket },
      { returnDocument: "after" }
    );

    if (!updatedUser || updatedUser === undefined) {
      throw "could not update event successfully";
    }
    return updatedUser;
};

// MOST IMP: If you are deleting a user, make sure to FIRST delete all the reviews, comments, and tags associated with it
// Route has been linked to this function
export const deleteUser = async (userId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const deleteInfo = await userCollection.deleteOne({ _id: userId });
    if (deleteInfo.deletedCount === 0)
      throw `Could not delete user with id of ${userId}`;
    return true;
  } catch (error) {
    throw error;
  }
};

export const getFollowing = async (userId) => {
    userId = new ObjectId(helper.checkObjectId(userId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId }) ;
    if (!user) throw "User not found";
    var followingList=[];
    for (let each of user.following) {
      var stringId=each.toString();
      var userObject=await getUserById(stringId);
      followingList.push(userObject);
    }
    return followingList;
};

//--------------- NO NEED FOR THIS (THE ABOVE FUNCTION IS ENOUGH) -----------------------



// export const getFollowers = async (userId) => {
//   try {
//     userId = helper.checkObjectId(userId);
//     const userCollection = await users();
//     const user = await userCollection.findOne({ _id: userId });
//     if (!user) throw "User not found";
//     return user.followers;
//   } catch (error) {
//     throw error;
//   }
// };

// export const getTags = async (userId) => {
//   try {
//     userId = helper.checkObjectId(userId);
//     const userCollection = await users();
//     const user = await userCollection.findOne({ _id: userId });
//     if (!user) throw "User not found";
//     return user.tags;
//   } catch (error) {
//     throw error;
//   }
// };

//Route has been linked to this function
export const addFollowing = async (userId, followingId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    followingId = new ObjectId(helper.checkObjectId(followingId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
      throw "User not found";
    }
    const followingUser = await userCollection.findOne({ _id: followingId });
    if (!followingUser) {
      throw "User not found";
    }
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { following: followingId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route has been linked to this function
export const removeFollowing = async (userId, followingId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    followingId = new ObjectId(helper.checkObjectId(followingId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
      throw "User not found";
    }
    const followingUser = await userCollection.findOne({ _id: followingId });
    if (!followingUser) {
      throw "User not found";
    }
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $pull: { following: followingId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//TODO why are we not using the above function instead of creating unncessary bloat
//Route has been linked to this function
export const addFollowerByUserName = async (mainUsername, followerUsername) => {
  let mainUser= await getUserByUsername(mainUsername);
  let followerUser= await getUserByUsername(followerUsername);
  let mainUserId=mainUser[0]._id.toString();
  let followerUserId=followerUser[0]._id.toString();
  let addedFollower=await addFollower(mainUserId,followerUserId);
  let addedFollowing=await addFollowing(followerUserId,mainUserId);
  return addedFollower && addedFollowing;
};

export const removeFollowerByUsername = async (mainUsername, followerUsername) => {
  let mainUser= await getUserByUsername(mainUsername);
  let followerUser= await getUserByUsername(followerUsername);
  let mainUserId=mainUser[0]._id.toString();
  let followerUserId=followerUser[0]._id.toString();
  let removedFollower=await removeFollower(mainUserId,followerUserId);
  let removedFollowing=await removeFollowing(followerUserId,mainUserId);
  return removedFollower && removedFollowing  ;
};

export const checkFollowerByUsername = async (mainUsername, followerUsername) => {
  let mainUser= await getUserByUsername(mainUsername);
  let followerUser= await getUserByUsername(followerUsername);
  let mainUserId=mainUser[0]._id.toString();
  let followerUserId=followerUser[0]._id.toString();
  return (await isFollower(mainUserId,followerUserId));
};

export const addFollower = async (userId, followerId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    followerId = new ObjectId(helper.checkObjectId(followerId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const followerUser = await userCollection.findOne({ _id: followerId });
    if (!followerUser) throw "User not found";
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { followers: followerId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//route has been linked to this function
export const removeFollower = async (userId, followerId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    followerId = new ObjectId(helper.checkObjectId(followerId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const followerUser = await userCollection.findOne({ _id: followerId });
    if (!followerUser) throw "User not found";
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $pull: { followers: followerId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};


export const isFollower = async (userId, followerId) => {

    userId = new ObjectId(await helper.checkObjectId(userId));
    followerId = new ObjectId(await helper.checkObjectId(followerId));

   
    const userCollection = await users();

  
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";

    
    // const isFollower = user.followers.includes(followerId);
    const isFollower = user.followers.map(id => id.toString()).includes(followerId.toString());

    return isFollower;
};
// Route has been linked to this function
export const addTags = async (userId, tags) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    tags = helper.checkString(tags);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { tags: tags }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route has been linked to this function
export const deleteTags = async (userId, tags) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    tags = helper.checkString(tags);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $pull: { tags: tags }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

// Route has been linked to this function
export const addReview = async (userId, reviewId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const reviewCollection = await reviews();
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { reviews: reviewId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//route has been linked to this function
export const deleteReview = async (userId, reviewId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    reviewId = new ObjectId(helper.checkObjectId(reviewId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const review = await reviewCollection.findOne({ _id: reviewId });
    if (!review) throw "Review not found";
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $pull: { reviews: reviewId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

// Route has been linked to this function
export const addComment = async (userId, commentId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    commentId = new ObjectId(helper.checkObjectId(commentId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const commentCollection = await comments();
    const comment = await commentCollection.findOne({ _id: commentId });
    if (!comment) throw "Comment not found";
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $addToSet: { comments: commentId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

//Route has been linked to this function
export const deleteComment = async (userId, commentId) => {
  try {
    userId = new ObjectId(helper.checkObjectId(userId));
    commentId = new ObjectId(helper.checkObjectId(commentId));
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: userId });
    if (!user) throw "User not found";
    const comment = await commentCollection.findOne({ _id: commentId });
    if (!comment) throw "Comment not found";
    const updateInfo = await userCollection.updateOne(
      { _id: userId },
      { $pull: { comments: commentId }, $set: { updatedAt: new Date() } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw "Update failed";
    return true;
  } catch (error) {
    throw error;
  }
};

// Route has been linked to this function
export const getUserByUsername = async (username) => {
    username = await helper.checkValidUsername(username);
    const userCollection = await users();
    const user = await userCollection
      .find({ username:username })
      .toArray();
    return user;
};

export const getUserByEmailAddress = async (contactEmail) => {
  try {
    contactEmail = helper.checkValidEmail(contactEmail);
    const userCollection = await users();
    const user = await userCollection.findOne({ contactEmail: contactEmail });
    return user;
  } catch (error) {
    throw error;
  }
};

// Route has been linked to this function
export const getAllUsers = async () => {
  try {
    const userCollection = await users();
    const user = await userCollection.find({}).toArray();
    return user;
  } catch (error) {
    throw error;
  }
};

//Route linked to this function
export const getAllUserWithPrefix = async(prefix) =>{
  try {
      prefix = helper.checkString(prefix, "prefix", 1, 50);
      const userCollection = await users();
      // name: { $regex: `^${prefix}`, $options: 'i' }  To search for prefix only
      const userList = await userCollection.find({username: { $regex: prefix, $options: 'i' }}).toArray(); // This to search for prefix anywhere in the string
      return userList;
      
  } catch (error) {
      throw error;
  }
}

export const getHomePageDetails = async (userId) => {
  userId = helper.checkObjectId(userId);
  const businessCollection = await businesses();
  const reviewCollection = await reviews();
  let followingUserIds = await getUserById(userId);
  const username = followingUserIds.username;

  followingUserIds= followingUserIds.following;

  if (followingUserIds.length === 0) {
    return {
      reviewsByFollowing: [],
      followingUsername: [],
    };
  }

  let followingUsername = [];

  for (let i = 0; i < followingUserIds.length; i++) {
    const followingUser = await getUserById(followingUserIds[i].toString());
    followingUserIds[i] = new ObjectId(followingUserIds[i]);
    const userData = {
      name: followingUser.username,
      userId: followingUserIds[i].toString(),
    };
    followingUsername.push(userData);
  }
  let reviewsByFollowing = await reviewCollection
    .find(
      { userId: { $in: followingUserIds } },
      {
        projection: {
          _id: 1,
          userId: 1,
          businessId: 1,
          rating: 1,
          reviewText: 1,
        },
      }
    )
    .toArray();

  for (let i = 0; i < reviewsByFollowing.length; i++) {
    const business = await businessCollection.findOne({
      _id: reviewsByFollowing[i].businessId,
    });
    reviewsByFollowing[i].businessName = business.name;
  }

  reviewsByFollowing = reviewsByFollowing.map((review) => {
    const user = followingUsername.find(
      (user) => user.userId === review.userId.toString()
    );
    return {
      _id: review._id.toString(),
      userId: review.userId.toString(),
      businessId: review.businessId.toString(),
      businessName: review.businessName,
      rating: review.rating,
      description: review.reviewText,
      username: user.username,
    };
  });

  return {
    reviewsByFollowing: reviewsByFollowing,
    followingUsername: followingUsername,
    username: username,
  };
};
