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

}

