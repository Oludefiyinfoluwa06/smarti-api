import { Schema, model, Document } from "mongoose";

export interface ICourse extends Document {
  title: string;
  description?: string;
  instructor?: string;
  duration?: string;
  price?: number;
  priceUSD?: number;
  modules?: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String },
    instructor: { type: String },
    duration: { type: String },
    price: { type: Number },
    priceUSD: { type: Number },
    modules: { type: Number },
    image: { type: String },
  },
  { timestamps: true }
);

export const Course = model<ICourse>("Course", CourseSchema);
