import { Document, Schema, model } from "mongoose";

export interface IAdmin extends Document {
  email: string;
  password: string;
  role: "admin";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Admin = model<IAdmin>("Admin", AdminSchema);
