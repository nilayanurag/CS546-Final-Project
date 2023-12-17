import express from "express";
import * as categoryData from "../data/category.js";
import * as helper from "../helpers/validation.js";
import * as routeHelper from "../helpers/routeHelper.js";
import xss from "xss";
const categoryRouter = express.Router()

categoryRouter
.route("/categories/getAll")
.get(async (req, res) => {  
    try {
        const categories = await categoryData.getAll();
        res.json(categories);
    } catch (e) {
        res.status(500).json({ errorMessage:"Internal Server Error" });
    }
    });

categoryRouter
.route("/categories/:id")
.get(async (req, res) => {
    let categoryIdVal= routeHelper.routeValidationHelper(helper.checkObjectId, xss(req.params.id));
    if (categoryIdVal[1]) {
        return res.status(400).json({ errorMessage: "Not a valid Object" });
        
    }
    try {
        const category = await categoryData.getById(categoryIdVal[0]);
        if (!category)
            return res.status(404).json({ errorMessage: "Category not found" });
        else{
            res.json(category);
        }
    } catch (e) {
        res.status(500).json({ errorMessage:"Internal Server Error" });
    }
});

export default categoryRouter;
