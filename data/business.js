import * as helper from "../helpers/validation.js"
import {businesses} from "../config/mongoCollections.js"
import { ObjectId } from "mongodb";

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

export const createBusiness = async(name, categoryId, addressObject)=>{
    try {
        name = helper.checkString(name, "Buisness name", 3, 50);
        categoryId = helper.checkObjectId(categoryId);
        addressObject = helper.checkAddress(addressObject);

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

export const addReview = async(reviewId, businessId)=>{
    try {
        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        businessId = new ObjectId(helper.checkObjectId(businessId));
        const businessCollection = await businesses();
        const business = await businessCollection.findOne({ _id: businessId});
        if (!business) throw "Business not found";
        const updateInfo = await businessCollection.updateOne({ _id: businessId }, { $addToSet: { reviews: reviewId }, $set: { updatedAt: new Date() } });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return true;
    } catch (error) {
        throw error;
    }
}

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

export const deleteReview = async(reviewId, businessId)=>{
    try{
        businessId = new ObjectId(helper.checkObjectId(businessId));
        reviewId = new ObjectId(helper.checkObjectId(reviewId));
        const businessCollection = await businesses();
        const business = await businessCollection.findOne({ _id: businessId });
        if (!business) throw "Business not found";
        const updateInfo = await businessCollection.updateOne({ _id: businessId }, { $pull: { reviews: reviewId }, $set: { updatedAt: new Date() } });
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount) throw 'Update failed';
        return true;

    }catch(error){
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

