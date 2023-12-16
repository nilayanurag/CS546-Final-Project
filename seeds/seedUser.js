import * as userData from "../data/users.js";


export const seedAllUser = async () => {
    try {
        const created=await userData.createUser(
            "nilayanurag",
            "Nilay",
            "Anurag",
            "male",
            30,
            "nilayanurag@gmail.com",
            "Password@123",
            {firstLine:"214",
            lastLine:"new york ave",
            country: "USA",
            city:"jersey city",
            state:"NJ",
            zip:"07307"
            }
        )
        console.log(created)
    
        
    } catch (error) {
        console.log(error)
    }
    
    try {
        const created=await userData.createUser(
            "nancyradadia",
            "Nancy",
            "Radadia",
            "female",
            22,
            "spiderman@gmail.com",
            "Password@123",
            {firstLine:"100",
            lastLine:"new york ave",
            country: "USA",
            city:"Brooklyn",
            state:"NY",
            zip:"11111"
            }
        )
        console.log(created)
    
        
    } catch (error) {
        console.log(error)
    }
    try {
        const created=await userData.createUser(
            "hitarthpatel",
            "Hitarth",
            "Patel",
            "male",
            24,
            "hitarthpatel@gmail.com",
            "Password@123",
            {firstLine:"84",
            lastLine:"Sherman ave",
            country: "USA",
            city:"Jersey City",
            state:"NJ",
            zip:"07307"
            }
        )
        console.log(created)
    
        
    } catch (error) {
        console.log(error)
    }
    try {
        const created=await userData.createUser(
            "rajpatel",
            "Raj",
            "Patel",
            "male",
            25,
            "rajpatel@gmail.com",
            "Password@123",
            {firstLine:"586",
            lastLine:"Elizabeth ave",
            country: "USA",
            city:"Somerset",
            state:"NJ",
            zip:"08854"
            }
        )
        console.log(created)
    
        
    } catch (error) {
        console.log(error)
    }
    try {
        const created=await userData.createUser(
            "prashilpatel",
            "Prashil",
            "Patel",
            "male",
            25,
            "prashilpatel@gmail.com",
            "Password@123",
            {firstLine:"550",
            lastLine:"Stelton Rd",
            country: "USA",
            city:"Piscataway",
            state:"NJ",
            zip:"08876"
            }
        )
        console.log(created)
    
        
    } catch (error) {
        console.log(error)
    }
    try {
        const created=await userData.createUser(
            "devmehta",
            "Dev",
            "Mehta",
            "male",
            24,
            "devmehta@gmail.com",
            "Password@123",
            {firstLine:"10",
            lastLine:"Downing St",
            country: "UK",
            city:"London",
            state:"LN",
            zip:"00010"
            }
        )
        console.log(created)
    
        
    } catch (error) {
        console.log(error)
    }
    try {
        const created=await userData.createUser(
            "harshnaik",
            "Harsh",
            "Naik",
            "male",
            24,
            "harshnaik@gmail.com",
            "Password@123",
            {firstLine:"100",
            lastLine:"Mountain view",
            country: "USA",
            city:"San Jose",
            state:"CA",
            zip:"07713"
            }
        )
        console.log(created)
    
        
    } catch (error) {
        console.log(error)
    }
}

