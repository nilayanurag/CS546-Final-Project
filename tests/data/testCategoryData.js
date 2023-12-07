import * as categoryFunctions from "../../data/category.js";


// Valid Input Testing


try {
    // Testing getCategoryByName
    let category = await categoryFunctions.getCategoryByName("Restaurant");
    if(category){
        console.log("Test 1: getCategoryByName passed");
        console.log(category);
    }

    // Testing getCategoryById
    let categoryId = await categoryFunctions.getCategoryById(category._id.toString());
    if(categoryId){
        console.log("Test 2: getCategoryById passed");
        console.log(categoryId);
    }
} catch (error) {
    console.log(error);
}

// Testing getAllCategory
try {
    let category = await categoryFunctions.getAllCategory();
    if(category){
        console.log("Test 3: getAllCategory passed");
        console.log(category);
    }
} catch (error) {
    console.log(error);
}

// Invalid Input Testing

try {
    // Testing getCategoryByName
    let category = await categoryFunctions.getCategoryByName("Rest");
    console.log(category);
}
catch (error) {
    console.log(error);
}

try {
    // Testing getCategoryById
    let category = await categoryFunctions.getCategoryById("5ce819935e539c343f141ecf");
    console.log(category);
}
catch (error) {
    console.log(error);
}

