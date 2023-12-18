import * as categoryFunctions from "../data/category.js";
import * as businessFunction from "../data/business.js";

export const seedAllBuisness = async () => {
    try {

        let category = await categoryFunctions.getCategoryByName("Restaurant");
        const buisness1 = await businessFunction.createBusiness("Napoli's Pizzeria", category._id.toString(), {
            firstLine: "1118 Washington St",
            lastLine: "Apt 1",
            country: "US",
            city: "Hoboken",
            state: "NJ",
            zip: "07307",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 1 created")
        }
    } catch (error) {
        throw error;
    }
    
    try {
    
        let category = await categoryFunctions.getCategoryByName("Restaurant");
        const buisness1 = await businessFunction.createBusiness("Honest", category._id.toString(), {
            firstLine: "811 Newark Ave",
            lastLine: "Apt 1",
            country: "US",
            city: "Jersey City",
            state: "NJ",
            zip: "07306",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 2 created")
        }
    } catch (error) {
        throw error;
    }
    
    try {
    
        let category = await categoryFunctions.getCategoryByName("Gym");
        const buisness1 = await businessFunction.createBusiness("Planet Fitness", category._id.toString(), {
            firstLine: "605 Washington St",
            lastLine: "Apt 1",
            country: "US",
            city: "Hoboken",
            state: "NJ",
            zip: "07030",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 3 created")
        }
    } catch (error) {
        throw error;
    }
    
    try {
    
        let category = await categoryFunctions.getCategoryByName("Park");
        const buisness1 = await businessFunction.createBusiness("Hoboken Park", category._id.toString(), {
            firstLine: "Sinatra Dr",
            lastLine: "Apt 1",
            country: "US",
            city: "Hoboken",
            state: "NJ",
            zip: "07030",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 4 created")
        }
    } catch (error) {
        throw error;
    }
    
    try {
    
        let category = await categoryFunctions.getCategoryByName("Cinema");
        const buisness1 = await businessFunction.createBusiness("AMC Newport", category._id.toString(), {
            firstLine: "30 Mall Dr W #300",
            lastLine: "Floor 3",
            country: "US",
            city: "Newport",
            state: "NJ",
            zip: "07310",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 5 created")
        }
    } catch (error) {
        throw error;
    }
    
    try {
    
        let category = await categoryFunctions.getCategoryByName("Salon");
        const buisness1 = await businessFunction.createBusiness("6th Borough Salon", category._id.toString(), {
            firstLine: "133 Madison St",
            lastLine: "Apt 1",
            country: "US",
            city: "Hoboken",
            state: "NJ",
            zip: "07030",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 6 created")
        }
    } catch (error) {
        throw error;
    }
    try {
    
        let category = await categoryFunctions.getCategoryByName("Gym");
        const buisness1 = await businessFunction.createBusiness("Heights Fitness", category._id.toString(), {
            firstLine: "100 Second Floor",
            lastLine: "Central Avenue",
            country: "US",
            city: "Jersey City",
            state: "NJ",
            zip: "07307",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 7 created")
        }
    } catch (error) {
        throw error;
    }
    try {
    
        let category = await categoryFunctions.getCategoryByName("Restaurant");
        const buisness1 = await businessFunction.createBusiness("Chipotle", category._id.toString(), {
            firstLine: "229",
            lastLine: "Washington Street",
            country: "US",
            city: "Hoboken",
            state: "NJ",
            zip: "07030",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 8 created")
        }
    } catch (error) {
        throw error;
    }
    try {
    
        let category = await categoryFunctions.getCategoryByName("Grocery");
        const buisness1 = await businessFunction.createBusiness("Patel Brothers", category._id.toString(), {
            firstLine: "718",
            lastLine: "Newark Avenue",
            country: "US",
            city: "Jersey City",
            state: "NJ",
            zip: "07003",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 9 created")
        }
    } catch (error) {
        throw error;
    }
    try {
    
        let category = await categoryFunctions.getCategoryByName("Cinema");
        const buisness1 = await businessFunction.createBusiness("AMC Empire 25", category._id.toString(), {
            firstLine: "234 W",
            lastLine: "42nd Street",
            country: "US",
            city: "New York City",
            state: "NY",
            zip: "10036",
        }
        );     
        if(buisness1.insertedBusiness){
            console.log("Buisness 10 created")
        }
    } catch (error) {
        throw error;
    }

}

