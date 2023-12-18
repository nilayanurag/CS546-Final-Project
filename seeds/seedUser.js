import * as userData from "../data/users.js";

export const seedAllUser = async () => {
  try {
    const created = await userData.createUser(
      "nilayanurag",
      "Nilay",
      "Anurag",
      "male",
      30,
      "nilayanurag@gmail.com",
      "Password@123",
      {
        firstLine: "214",
        lastLine: "new york ave",
        country: "US",
        city: "jersey city",
        state: "NJ",
        zip: "07307",
      }
    );
    console.log(created);
  } catch (error) {
    console.log(error);
  }

  try {
    const created = await userData.createUser(
      "nancyradadia",
      "Nancy",
      "Radadia",
      "female",
      22,
      "nancyradadia@gmail.com",
      "Password@123",
      {
        firstLine: "100",
        lastLine: "new york ave",
        country: "US",
        city: "Brooklyn",
        state: "NY",
        zip: "11111",
      }
    );
    console.log(created);
  } catch (error) {
    console.log(error);
  }
  try {
    const created = await userData.createUser(
      "hitarthpatel",
      "Hitarth",
      "Patel",
      "male",
      24,
      "hitarthpatel@gmail.com",
      "Password@123",
      {
        firstLine: "84",
        lastLine: "Sherman ave",
        country: "US",
        city: "Jersey City",
        state: "NJ",
        zip: "07307",
      }
    );
    console.log(created);
  } catch (error) {
    console.log(error);
  }
  try {
    const created = await userData.createUser(
      "rajpatel",
      "Raj",
      "Patel",
      "male",
      25,
      "rajpatel@gmail.com",
      "Password@123",
      {
        firstLine: "586",
        lastLine: "Elizabeth ave",
        country: "US",
        city: "Somerset",
        state: "NJ",
        zip: "08854",
      }
    );
    console.log(created);
  } catch (error) {
    console.log(error);
  }
  try {
    const created = await userData.createUser(
      "prashilpatel",
      "Prashil",
      "Patel",
      "male",
      25,
      "prashilpatel@gmail.com",
      "Password@123",
      {
        firstLine: "550",
        lastLine: "Stelton Rd",
        country: "US",
        city: "Piscataway",
        state: "NJ",
        zip: "08876",
      }
    );
    console.log(created);
  } catch (error) {
    console.log(error);
  }
  try {
    const created = await userData.createUser(
      "aashmiparmar",
      "Aashmi",
      "Parmar",
      "female",
      22,
      "aashmiparmar@gmail.com",
      "Password@123",
      {
        firstLine: "10",
        lastLine: "Downing St",
        country: "US",
        city: "Jeresy City",
        state: "NJ",
        zip: "00010",
      }
    );
    console.log(created);
  } catch (error) {
    console.log(error);
  }
  try {
    const created = await userData.createUser(
      "harvishJ",
      "Harvish",
      "Jariwala",
      "male",
      23,
      "harvishjariwala@gmail.com",
      "Password@123",
      {
        firstLine: "100",
        lastLine: "Mountain view",
        country: "US",
        city: "San Jose",
        state: "CA",
        zip: "07713",
      }
    );
    console.log(created);
  } catch (error) {
    console.log(error);
  }

  // add following and followers

  var user1 = await userData.getUserByUsername("nilayanurag");
  user1 = user1[0];
  var user2 = await userData.getUserByUsername("nancyradadia");
  user2 = user2[0];
  var user3 = await userData.getUserByUsername("hitarthpatel");
  user3 = user3[0];
  var user4 = await userData.getUserByUsername("rajpatel");
  user4 = user4[0];
  var user5 = await userData.getUserByUsername("prashilpatel");
  user5 = user5[0];
  var user6 = await userData.getUserByUsername("aashmiparmar");
  user6 = user6[0];
  var user7 = await userData.getUserByUsername("harvishJ");
  user7 = user7[0];
  try {
    const follow1 = await userData.addFollowing(
      user1._id.toString(),
      user2._id.toString()
    );
    const follower1 = await userData.addFollower(
      user2._id.toString(),
      user1._id.toString()
    );
    const follow2 = await userData.addFollowing(
      user1._id.toString(),
      user3._id.toString()
    );
    const follower2 = await userData.addFollower(
      user3._id.toString(),
      user1._id.toString()
    );
    const follow3 = await userData.addFollowing(
      user1._id.toString(),
      user4._id.toString()
    );
    const follower3 = await userData.addFollower(
      user4._id.toString(),
      user1._id.toString()
    );
    const follow4 = await userData.addFollowing(
      user2._id.toString(),
      user5._id.toString()
    );
    const follower4 = await userData.addFollower(
      user5._id.toString(),
      user2._id.toString()
    );
    const follow5 = await userData.addFollowing(
      user3._id.toString(),
      user6._id.toString()
    );
    const follower5 = await userData.addFollower(
      user6._id.toString(),
      user3._id.toString()
    );
    const follow6 = await userData.addFollowing(
      user2._id.toString(),
      user7._id.toString()
    );
    const follower6 = await userData.addFollower(
      user7._id.toString(),
      user2._id.toString()
    );
    const follow7 = await userData.addFollowing(
      user3._id.toString(),
      user7._id.toString()
    );
    const follower7 = await userData.addFollower(
      user7._id.toString(),
      user3._id.toString()
    );
    const follow8 = await userData.addFollowing(
      user7._id.toString(),
      user2._id.toString()
    );
    const follower8 = await userData.addFollower(
      user2._id.toString(),
      user7._id.toString()
    );
    const follow9 = await userData.addFollowing(
      user1._id.toString(),
      user7._id.toString()
    );
    const follower9 = await userData.addFollower(
      user7._id.toString(),
      user1._id.toString()
    );
    const follow10 = await userData.addFollowing(
      user2._id.toString(),
      user1._id.toString()
    );
    const follower10 = await userData.addFollower(
      user1._id.toString(),
      user2._id.toString()
    );
    const follow11 = await userData.addFollowing(
      user3._id.toString(),
      user1._id.toString()
    );
    const follower11 = await userData.addFollower(
      user1._id.toString(),
      user3._id.toString()
    );
    const follow12 = await userData.addFollowing(
      user4._id.toString(),
      user7._id.toString()
    );
    const follower12 = await userData.addFollower(
      user7._id.toString(),
      user4._id.toString()
    );
    console.log(follow1);
    console.log(follower1);
    console.log(follow2);
    console.log(follower2);
    console.log(follow3);
    console.log(follower3);
    console.log(follow4);
    console.log(follower4);
    console.log(follow5);
    console.log(follower5);
    console.log(follow6);
    console.log(follower6);
    console.log(follow7);
    console.log(follower7);
    console.log(follow8);
    console.log(follower8);
    console.log(follow9);
    console.log(follower9);
    console.log(follow10);
    console.log(follower10);
    console.log(follow11);
    console.log(follower11);
    console.log(follow12);
    console.log(follower12);
  } catch (error) {
    console.log(error);
  }
};
