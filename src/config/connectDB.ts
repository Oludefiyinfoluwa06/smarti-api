import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

export async function connectDB() {
  try {
    await mongoose.connect(`${DB_URI}`);
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error(`MongoDB connection failed:`, err);
  }
}
