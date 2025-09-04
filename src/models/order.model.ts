import { Document, Schema, model } from "mongoose";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Accepted"
  | "Declined";

export type PackageType = "StudyLite" | "StudyPro";

export interface IPackageItem {
  type: PackageType;
  qty: number;
}

export interface IOrder extends Document {
  customer: string;
  email: string;
  phone: string;
  address: string;
  packageItems: IPackageItem[];
  total: number;
  status: OrderStatus;
  orderId: string;
  paymentStatus?: "pending" | "completed" | "failed";
  paymentReference?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const PackageItemSchema = new Schema<IPackageItem>({
  type: { type: String, enum: ["StudyLite", "StudyPro"], required: true },
  qty: { type: Number, required: true, min: 1 },
});

const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    packageItems: { type: [PackageItemSchema], required: true, validate: (v: any[]) => Array.isArray(v) && v.length > 0 },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Accepted", "Declined"],
      default: "Pending",
    },
    orderId: { type: String, required: true },
    paymentStatus: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    paymentReference: { type: String },
  },
  { timestamps: true }
);

export const Order = model<IOrder>("Order", OrderSchema);
