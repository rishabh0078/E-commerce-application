import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on('connected', () => {
        console.log("MongoDB connected");
    })

    mongoose.connection.on('error', (err) => {
        console.log("MongoDB connection error:", err.message);
    })

    mongoose.connection.on('disconnected', () => {
        console.log("MongoDB disconnected");
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)

}

export default connectDB;