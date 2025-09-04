import mongoose from "mongoose";
import { seedAdmin } from "./seedAdmin";

const DB_URI = `${process.env.DB_URI}`;

export async function connectDB() {
  try {
    await mongoose.connect(DB_URI);
    await seedAdmin();
    console.log("MongoDB connected");
  } catch (err: any) {
    console.error(`MongoDB connection failed:`, err);
  }
}
