# CS546-Final-Project

## How to run the file
```
npm install
npm run dev or npm start
```

After the server is up, the You need to run the seed file to populate the data

```
npm run seed 
```

The data will be populated in your database.
You can check our functionalitites by either creading an account or login to existing account

One of the existing credentials you can use to test:
```
email: nilayanurag@gmail.com
password: Password@123
```

## Functionalities Implemented

Proper validation (clientside, routeside and data function) have been implemented for all the functionalities.

1. Authentication: User can login/register. 
   
2. Search user: User can search people by username. You can search business on the basis of the demography
  
4. Follow/UnFollow: You can follow or unfollow users you have searched for (try typing names like nancy or harvish to test)

5. Add/Delete comments: Click on feed (any review) there you can add and delete comment for that review.

6. Create Review or Business: User can add review of a particular business, and if the business does not exists user can create it.

7. Update/Delete Review: User will not be able to add duplicate reviews, i.e. if the user has already posted a review for Napoli's Pizzeria then he won't be able to add the second review again, hence making sure that user cannot spam review. However, user can update their currect review as well as delete their review.

8. My Review: User can see all their review user MyReview

9.  Update your profile: User can update their existing profile.

