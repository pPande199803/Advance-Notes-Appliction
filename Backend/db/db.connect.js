import mongoose from "mongoose";

const dbConnected = async(uri) => {
    try {
        await mongoose.connect(uri);
        console.log(`Database Connect Successfully...`)
    } catch (error) {
        console.log(`Database side error -- ${error}`)
    }
}

export default dbConnected