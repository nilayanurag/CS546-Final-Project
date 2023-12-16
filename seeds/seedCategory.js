import * as categoryFunctions from "../data/category.js";

export const seedAllCategory = async () => {

  try {
    const category1 = await categoryFunctions.createCategory("Restaurant", [
      "non-veg",
      "veg",
      "liquor",
    ]);
    if(category1.insertedCategory){
        console.log("Category 1 created")
    }
  } catch (error) {
    throw error;
  }
  
  try {
      const category2 = await categoryFunctions.createCategory("Salon", [
        "waxing",
        "haircut",
        "haircolor",
        "pedicure",
        "menicure",
      ]);
      if(category2.insertedCategory){
          console.log("Category 2 created")
      }
    } catch (error) {
      throw error;
    }
  
    try {
      const category3 = await categoryFunctions.createCategory("Park", [
        "tennis Court",
        "basketball Court",
        "playground",
        "skating Ring",
        "soccer Field",  
      ]);
      if(category3.insertedCategory){
          console.log("Category 3 created")
      }
    } catch (error) {
      throw error;
    }
  
    try {
      const category4 = await categoryFunctions.createCategory("Cinema", [
        "3-D",
        "4_D",
        "IMAX",
        "Dolby Atmos"
      ]);
      if(category4.insertedCategory){
          console.log("Category 4 created")
      }
    } catch (error) {
      throw error;
    }
  
    try {
      const category5 = await categoryFunctions.createCategory("Gym", [
          "cardio",
          "weight training",
          "yoga",
          "zumba",
          "aerobics",
          "crossfit",
          "boxing",
          "martial arts",
          "kickboxing",
      ]);
      if(category5.insertedCategory){
          console.log("Category 5 created")
      }
      
    } catch (error) {
      throw error;
    }
  
    try {
      const category6 = await categoryFunctions.createCategory("Grocery", [
          "Pulses",
          "Frozen",
          "Snacks",
          ]);
      if(category6.insertedCategory){
          console.log("Category 6 created")
      }
      
    } catch (error) {
      throw error;
    }
}
