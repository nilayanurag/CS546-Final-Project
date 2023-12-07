import * as reviewFunctions from '../../data/review.js';
import * as userFunctions from '../../data/users.js';
import * as commentFunctions from '../../data/comments.js';

let commentId;
let userId
let reviewId;

try{
    const user = await userFunctions.getAllUsers();
    userId = user[0]._id.toString();
    const review = await reviewFunctions.getAllReviews();
    reviewId = review[0]._id.toString();
    const comment = await commentFunctions.getCommentsByReviewId(reviewId);
    commentId = comment[0]._id.toString();
}catch(error){
    throw error;
}


try {
    await reviewFunctions.getReviewById(reviewId);
    console.log("Test 1: Get review by ID passed")
    
} catch (error) {
    throw error;
}

try{
    await reviewFunctions.addThumbsUp(reviewId,userId)
    console.log("Test 2: Add thumbs up passed")
}catch(error){
    throw error;
}

try{
    await reviewFunctions.removeThumbsUp(reviewId,userId)
    console.log("Test 3: Delete thumbs up passed")
}catch(error){
    throw error;
}

try{
    await reviewFunctions.addThumbsDown(reviewId,userId)
    console.log("Test 4: Add thumbs down passed")

}catch(error){
    throw error;
}

try{
    await reviewFunctions.removeThumbsDown(reviewId,userId)
    console.log("Test 5: Delete thumbs down passed")   
}catch(error){
    throw error;
}

try{
    await reviewFunctions.addComment(reviewId,commentId)
    console.log("Test 6: Add comment passed")
}
catch(error){
    throw error;
}

try{
    await reviewFunctions.removeComment(reviewId,commentId)
    console.log("Test 7: Delete comment passed")
}
catch(error){
    throw error;
}

