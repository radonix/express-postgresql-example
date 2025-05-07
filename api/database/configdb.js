import mongoose from 'mongoose';

const connect = async () => {
    try{
        mongoose.set("strictQuery",true);
        if (!process.env.MONGO_URI || !process.env.MONGO_DB_NAME) {
            throw new Error("Environment variables MONGO_URI or MONGO_DB_NAME are not defined");
        }
        await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB_NAME });
        console.log("MongoDB connected");

    }
    catch(error){
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}
export default {connect};