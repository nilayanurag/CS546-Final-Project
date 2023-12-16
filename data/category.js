import * as helper from "../helpers/validation.js";
import { categories } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

// not needed yet
export const createCategory = async (name, tags) => {
  try {
    name = helper.checkString(name, "category name", 1, 50);
    tags = helper.checkArray(tags, "category tags");
    tags = helper.checkArrayOfStrings(tags, "tags");

    const categoryCollection = await categories();
    const newCategory = await categoryCollection.insertOne({
      name: name,
      tags: tags,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return { insertedCategory: newCategory.insertedId ? true : false };
  } catch (error) {
    throw error;
  }
};

//Route: GET /categories/:id
export const getCategoryById = async (categoryId) => {
    try {
        categoryId = new ObjectId(helper.checkObjectId(categoryId));
        const categoryCollection = await categories();
        const category = await categoryCollection.findOne({ _id: categoryId });
        if (!category) throw "Category not found";
        return category;
    } catch (error) {
        throw error;
    }
};

//not needed
export const getCategoryByName = async (categoryName) => {
    try {
        categoryName = helper.checkString(categoryName, "categoryName", 1, 50);
        const categoryCollection = await categories();
        const category = await categoryCollection.findOne({ name: categoryName });
        if (!category) throw "Category not found";
        return category;
        
    } catch (error) {
        throw error;
    }
};


// Route: GET /categories/getAll
export const getAllCategory = async () => {
    try {
        const categoryCollection = await categories();
        const category = await categoryCollection.find({}).toArray();
        if (!category) throw "Category not found";
        return category;
        
    } catch (error) {
        throw error;
    }
};
