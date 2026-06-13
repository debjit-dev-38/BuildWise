import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb=async()=>{
    try{
        const connectInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DB connected DB Host: ${connectInstance.connection.host}`)

    }
    catch(error)
    {
        console.log("MongoDB connection failed", error)
        process.exit(1)
    }
}

export default connectDb



















// import mongoose from "mongoose"
// import {DB_NAME} from "../constants.js"

// const connectDB= async()=>{
//     try{
//         const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n MongoDb connected !! DB HOST: ${connectionInstance.connection.host}`)
//     }catch(error){
//         console.log("MONGODB connection failed ", error)
//         process.exit(1)
//     }
// }

// export default connectDB