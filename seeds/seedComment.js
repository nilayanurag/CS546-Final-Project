import * as reviewFunction from "../data/review.js";
import * as userFunction from "../data/users.js";
import * as commentFunction from "../data/comments.js";


export const seedAllComment = async () => {
    try {

        const getUser = await userFunction.getAllUsers();
        const testUser = getUser[0]._id.toString();
        const getReview = await reviewFunction.getAllReviews();
        const testReview = getReview[0]._id.toString();
    
        const testComment = await commentFunction.createComment( testReview, testUser, "This is a test comment");
        if (testComment.insertedComment) {
            console.log("Comment seeded");
        } else {
            console.log("Comment not seeded");
        }
        
    } catch (error) {
        throw error;
    }    
}
