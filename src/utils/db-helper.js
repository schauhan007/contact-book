import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const connectDB = async (req, res) => {
    try {
        
        mongoose.connect(process.env.DB_URL)
        console.log("Database connected");
        

    } catch (error) {
        console.log(error);
        throw error;
    }
}