import * as helper from "../helpers/validation.js";
import { users } from "../config/mongoCollections.js";

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

export const createUser = async (
  firstName,
  lastName,
  sex,
  age,
  contactEmail,
  password,
  following,
  followers,
  tags,
  location
) => {
  // Validate input using helper functions
  firstName = helper.checkString(firstName, "g", 1, 50);
  lastName = helper.checkString(lastName, "h", 1, 50);
  sex = helper.checkString(sex);

  // Additional validations...

  // Hash the password using bcrypt
  const saltRounds = 1; // Change back to 16 later on
  const hash = await bcrypt.hash(password, saltRounds);

  // Create a new user object
  const newUser = {
    firstName,
    lastName,
    sex,
    age,
    contactEmail,
    password: hash,
    following: [],
    followers: [],
    tags: [],
    location,
    reviews: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Insert the new user into the users collection
  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);

  if (insertInfo.insertedCount === 0) {
    throw "Error: Could not create user.";
  }

  return newUser;

  /*this is a basic template I have use from hw just to get it started* /
    firstName=helper.checkString(firstName,1,50)
    lastName=helper.checkString(lastName,1,50)
    sex=helper.checkString(sex)
    */

  // Create a new user and return its Id
};

export const getUser = async (userId) => {};

export const updateUser = async (
  userId,
  firstName,
  lastName,
  sex,
  age,
  contactEmail,
  password,
  location
) => {
  /*
    create empty array like
    following,
    followers,
    tags,
    reviews
    comments
    put a "created" timesteamp
    */
};

export const updateLastTimeStamp = async (userId) => {
  /*
    Call this in every function to update the date
     */
};

export const deleteUser = async (userId) => {};

export const getFollowing = async (userId) => {};

export const getFollowers = async (userId) => {};

export const getTags = async (userId) => {};

export const addFollowing = async (userId, followingId) => {};

export const addFollower = async (userId, followerId) => {};

export const addTags = async (userId, tags) => {};

export const addReview = async (userId, reviewId) => {};

export const deleteReview = async (userId, reviewId) => {};

export const addComment = async (userId, commentId) => {};

export const deleteComment = async (userId, commentId) => {};
