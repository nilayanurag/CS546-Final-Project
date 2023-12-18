import * as category from "./seedCategory.js";
import * as business from "./seedBusiness.js";
import * as user from "./seedUser.js";
import * as review from "./seedReview.js";
import * as comment from "./seedComment.js";

try {
  await category.seedAllCategory();
  await business.seedAllBuisness();
  await user.seedAllUser();
  await review.seedAllReview();
  await comment.seedAllComment();
  console.log("All seeded");
  process.exit(0);
} catch (error) {
  throw error;
}
 