import * as userFunctions from "../../data/users.js";

// 1. delete user
// 2. update user
// 3. find user by id

let user1;
let user2;

try {
  const user =  await userFunctions.getAllUsers();
  user1 = user[0]._id.toString();
  user2 = user[1]._id.toString();
  
} catch (error) {
  
}

try {
  const user = await userFunctions.updateUser(
    user2,
    "nancyradadia",
    "Nancy",
    "Radadia",
    "Female",
    22,
    "spiderman@gmail.com",
    "Password@123",
    {
      firstLine: "100",
      lastLine: "new york ave",
      country: "USA",
      city: "Brooklyn",
      state: "NY",
      zip: "11111",
    }
  );
  console.log("Test 1: Update User", user);
} catch (error) {
  throw error;
}

try {
  const user = await userFunctions.getUserById(user1);
  console.log("Test 2: Get User By Id", user);
} catch (error) {
  throw error;
}

try {
  const user = await userFunctions.addFollowing(
    user1,
    user2
  );
  console.log("Test 3: Add Following", user);
} catch (error) {
  throw error;
}

try {
  const user = await userFunctions.addFollower(
    user1,
    user2
  );
  console.log("Test 4: Add Follower", user);
} catch (error) {
  throw error;
}

// try {
//   const user = await userFunctions.removeFollowing(
//     user1,
//     user2
//   );
//   console.log("Test 5: Delete Following", user);
// } catch (error) {
//   throw error;
// }

try {
  const user = await userFunctions.removeFollower(
    user1,
    user2
  );
  console.log("Test 6: Delete Follower", user);
} catch (error) {
  throw error;
}

try {
  const user = await userFunctions.getUserByUsername("nancyrada");
  console.log("Test 7: Get User By Username", user);
} catch (error) {
  throw error;
}

try {
    const user = await userFunctions.addTags(user1,"veg");
    console.log("Test 8: Add Tags", user);
} catch (error) {
  throw error;
}

try {
    const user = await userFunctions.deleteTags(user1,"veg");
    console.log("Test 9: Delete Tags", user);
} catch (error) {
  throw error;
}

try{
  const user = await userFunctions.getHomePageDetails("657170a745572a5c1e835e1f");
  console.log("Test 10: Get Home Page Details", user);

}catch(error){
  throw error;
}


