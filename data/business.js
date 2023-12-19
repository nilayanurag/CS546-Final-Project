import * as helper from "../helpers/validation.js"
import {businesses, reviews, categories,users} from "../config/mongoCollections.js"
import { ObjectId } from "mongodb";
import { compareSync } from "bcrypt";
import * as userData from "../data/users.js";
import * as reviewData from "../data/review.js";
import * as categoryData from "../data/category.js";
import * as businessData from "../data/business.js";

/*
business:{
    _id: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    name: “Napoli's Pizzeria”
    categoryId: “7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310”,
    location: {
        firstLine: “1118 Washington St”,
        secondLine: “Apt 1”,
        country: “US”,
        city: “Hoboken”,
        state: “NJ”,
        zip: “07307”,
    },
    reviews:[]
    averageRating: 4.5,
    createdAt: 2022-02-26T16:37:48.244Z,
    updatedAt: 2022-02-26T16:37:48.244Z
} */

// Route: POST /business/createBusiness 
export const createBusiness = async(name, categoryId, addressObject)=>{
    try {
        name = helper.checkString(name, "Buisness name", 3, 50);
        categoryId = new ObjectId(helper.checkObjectId(categoryId));
        addressObject = helper.checkAddress(addressObject);

        const categoryCollection = await categories();
        const category =  await categoryCollection.findOne({ _id: categoryId });
        if (!category) throw "Category not found";

        const businessCollection = await businesses();
        const newBusiness = await businessCollection.insertOne({
            name: name,
            categoryId: categoryId,
            location: addressObject,
            reviews: [],
            averageRating: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return { insertedBusiness: newBusiness.insertedId ? true : false };
    } catch (error) { 
        throw error;  
    }
}

//Route: GET /business/getBusiness/:pre
export const getAllBusinessWithPrefix = async(prefix) =>{
    try {
        prefix = helper.checkString(prefix, "prefix", 1, 50);
        const businessCollection = await businesses();
        // name: { $regex: `^${prefix}`, $options: 'i' }  To search for prefix only
        const business = await businessCollection.find({name: { $regex: prefix, $options: 'i' }}).toArray(); // This to search for prefix anywhere in the string
        return business;
        
    } catch (error) {
        throw error;
    }
}


// Route: GET /business/getBusinessByName/:name
export const getBusinessByName = async(name)=>{
    try {
        name = helper.checkString(name, "Buisness name", 3, 50);
        const businessCollection = await businesses();
        const business = await businessCollection.findOne({ name: name });
        if (!business) throw "Business not found";
        return business;
    } catch (error) {
        throw error;
    }
}

// Route: GET /business/deleteBusiness/:id
export const deleteBusiness = async(businessId)=>{
    try {
        businessId = new ObjectId(helper.checkObjectId(businessId));
        const businessCollection = await businesses();
        const business = await businessCollection.findOne({ _id: businessId });
        if (!business) throw "Business not found";
        const deleteInfo = await businessCollection.deleteOne({ _id: businessId });
        if (deleteInfo.deletedCount === 0) throw `Could not delete business with id of ${businessId}`;
        return true;
    } catch (error) {
        throw error;
    }
}

//Route not needed
export const addReview = async(reviewId, businessId)=>{
    try {
        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        businessId = new ObjectId(helper.checkObjectId(businessId));
        const businessCollection = await businesses();
        const business = await businessCollection.findOne({ _id: businessId});
        if (!business) throw "Business not found";
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: reviewId });
        if (!review) throw "Review not found";
        const updateInfo = await businessCollection.updateOne({ _id: businessId }, { $addToSet: { reviews: reviewId }, $set: { updatedAt: new Date() } });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return true;
    } catch (error) {
        throw error;
    }
}

// Route not needed
export const getAllReview = async(businessId)=>{
    try {
        businessId = new ObjectId(helper.checkObjectId(businessId));
        const businessCollection = await businesses();
        const business = await businessCollection.findOne({ _id: businessId });
        if (!business) throw "Business not found";
        return business.reviews;
    } catch (error) {
        throw error;
    }
}

//Route not needed
export const deleteReview = async(reviewId, businessId)=>{
    try{
        businessId = new ObjectId(helper.checkObjectId(businessId));
        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        const businessCollection = await businesses();
        const business = await businessCollection.findOne({ _id: businessId });
        if (!business) throw "Business not found";
        const reviewCollection = await reviews();
        const review = await reviewCollection.findOne({ _id: reviewId });
        if (!review) throw "Review not found";
        const updateInfo = await businessCollection.updateOne({ _id: businessId }, { $pull: { reviews: reviewId }, $set: { updatedAt: new Date() } });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return true;

    }catch(error){
        throw error;
    }
}

// Route: GET /business/getBusinessById/:id
export const getBusinessById = async(businessId)=>{
    try {
        businessId = new ObjectId(helper.checkObjectId(businessId));
        const businessCollection = await businesses();
        const business = await businessCollection.findOne({ _id: businessId });
        if (!business) throw "Business not found";
        return business;
    } catch (error) {
        throw error;
    }
}

export const getBusinessesByCategory = async(categoryId)=>{
    try {
        categoryId = new ObjectId(helper.checkObjectId(categoryId));
        const businessCollection = await businesses();
        const business = await businessCollection.find({ categoryId: categoryId }).toArray();
        if (!business) throw "Business not found";
        return business;
        
    } catch (error) {
        throw error;
    }
}

// To be completed later
export const updateGlobalRating = async (businessId) => {
    // try {
    //     businessId = helper.checkObjectId(businessId);
    //     const businessCollection = await businesses();
    //     const business = await businessCollection.findOne({ _id: businessId });
    //     if (!business) throw "Business not found";
    //     const reviews = business.reviews;
    //     // Use the reviews array for further processing
    // } catch (error) {
    //     throw error;
    // }
}

// export const getBusinessRankingList = async (taskInfo) => {
//     const categoryCollection = await categories();
//     const reviewCollection = await reviews();
//     const userCollection = await users();
//     const businessCollection    = await businesses();

//     let categoryList = await categoryCollection.find({}).toArray();

//     if (taskInfo){}
//     else{throw "No task"}

//     if (categoryList.some(category => category.name === taskInfo.category)) {
//         console.log(categoryList)
//     }else{throw""}

//     let catInfo=await categoryCollection.findOne({name: taskInfo.category})

//     let allSelected=await businessCollection.find({categoryId: catInfo._id}).toArray()
//     let userInfo=   await userData.getUserByUsername(taskInfo.username);
//     userInfo=userInfo[0]
//     let busList=[]
//     // userInfo.following=userInfo.following.map(id => id.toString())
//     for (let eachBus of allSelected){
//         let reviews=eachBus.reviews;
//         var reviewList=[]
//         console.log(reviews.length)
//         for (let eachReview of reviews){
//             let eachReviewInfo=await reviewCollection.findOne({_id: eachReview});
//             if (userInfo.following.map(id => id.toString()).includes(eachReviewInfo.userId.toString())) {
            
//                 // if (taskInfo.min){
//                 //     if (userInfo.age>taskInfo.min){
//                 //         continue;
//                 //     }
//                 // }
//                 // if (taskInfo.max){
//                 //     if (userInfo.age<taskInfo.max){
//                 //         continue;
//                 //     }
//                 // }
//                 // if (taskInfo.male){
//                 //     if (!(userInfo.male=="male")){
//                 //         continue;
//                 //     }
//                 // }
//                 // if (taskInfo.female){
//                 //     if (!(userInfo.female==="female")){
//                 //         continue;
//                 //     }
//                 // }
//                 eachReviewInfo._id=eachReviewInfo._id.toString()
//                 reviewList.push(eachReviewInfo);
//             }
                
//         let customRating=await reviewData.calculateRating(reviewList)
//         eachBus.vibeRating=customRating
//         busList.push(eachBus)
        
//         }
//     }
//     busList.sort((a,b)=>{return b.vibeRating-a.vibeRating})
//     return busList;
// }  

export const rateAllBusines = async () => {
    const businessCollection = await businesses();
    const allBusiness = await businessCollection.find({}).toArray();
    let allBusinessList=[]
    try {
      for (let each of allBusiness) {
        let updatedBusiness= await populateRating(each._id.toString());
        allBusinessList.push(updatedBusiness)
      }
      
    } catch (error) {
      console.log("error in populateAllRating:",error); 
    }
  
}
  
  export const populateRating = async (businessId) => {
    businessId = new ObjectId(helper.checkObjectId(businessId));
    const businessCollection = await businesses();
    const reviewCollection = await reviews();
    
    const business = await businessCollection.findOne({ _id: businessId });
    if (!business) throw "Business not found";

    let reviewsListOfOne = business.reviews;
    let reviewList=[]
    for (let eachReview of reviewsListOfOne) {
        
      let eachReviewInfo = await reviewCollection.findOne({ _id: eachReview });
      if (!eachReviewInfo) 
        // throw "Review not found";
        continue
      eachReviewInfo._id = eachReviewInfo._id.toString();
      reviewList.push(eachReviewInfo._id);
    }
    let  averageRating = await calculateRating(reviewList);
    let foundBusiness=await businessCollection.findOneAndUpdate({_id: businessId},{$set: {averageRating: averageRating}})
    return foundBusiness;
  }
    

  export const calculateRating = async (reviewList) => {
    let ratingList=[]
    const reviewCollection = await reviews();
    for (let each of reviewList) {
      var reviewId = new ObjectId(each);
      var review = await reviewCollection.findOne({ _id: reviewId });
      ratingList.push(review.rating||0);
  
    }
    const sum = ratingList.reduce((a, b) => a + b, 0);
    const avg = (sum / ratingList.length) || 0;
    let mean=  Number(avg.toFixed(1))
    console.log(mean)
    return mean
  }


  export const getBusinessRankingList = async (categorySelect,username,minAge,maxAge,male,female,friends) => {
    const businessCollection = await businesses();
    const categoryCollection = await categories();
    const userCollection = await users();
    const reviewCollection = await reviews();
    
    let categoryId=undefined;
    let allBusinessList=[]
    let businessList = await businessCollection.find({}).sort({ averageRating: -1 }).toArray();
    let userInfo=await userData.getUserByUsername(username[0]);
    let userInfoFollowing=userInfo[0].following.map(id => id.toString())
    let allCat=await categoryCollection.find({}).toArray()
    allCat=allCat.map(each=>each.name)
    if(allCat.includes(categorySelect)){
        let categoryInfo=await categoryData.getCategoryByName(categorySelect)
        for (let each of businessList) {
            if (each.categoryId.toString()===categoryInfo._id.toString()){    
                each.categoryName=categorySelect
            allBusinessList.push(each)
             }
        }
    }else {
        
        for (let each of businessList) {
            let categoryData=await categoryCollection.findOne({ _id: each.categoryId })
            each.categoryName=categoryData.name
            allBusinessList.push(each)
        } 
        console.log(allBusinessList)
    }
    let fineTunedList=[]
    for (let eachBus of allBusinessList){
        let reviewList=eachBus.reviews;
        let selectReviewList=[]
        for(let eachReview of reviewList){
            let reviewInfo=await reviewCollection.findOne({_id: eachReview})
            let reviewerInfo=await userData.getUserById(reviewInfo.userId.toString())
            let valid=true
            if (friends){
                if (userInfoFollowing.includes(reviewerInfo._id.toString())){
                }else{
                    valid=false
                }
            }

            if (female&&male){}
            else if (!(female||male)){

            }else   if (!female && reviewerInfo.sex=="female"){
                    valid=false
                }
                else if (!male && reviewerInfo.sex=="male"){    
                    valid=false
                }
            if (minAge){
                if (reviewerInfo.age<minAge){
                    valid=false
                }
            }
            if (maxAge){
                if (reviewerInfo.age>maxAge){
                    valid=false
                }
            }
            if (valid==true){
                selectReviewList.push(reviewInfo._id.toString())
            }
        }
        let vibeRating=await calculateRating(selectReviewList)
        eachBus.personalizedRating=vibeRating
        fineTunedList.push(eachBus)
        if (fineTunedList.length>=10){
            break;
        }

    }
    if (friends){
        return fineTunedList.sort((a,b)=>{return b.personalizedRating-a.personalizedRating})
    }
    
    else{
        return fineTunedList.sort((a,b)=>{return b.averageRating-a.averageRating})
    }
    }  


