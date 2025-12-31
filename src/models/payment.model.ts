import { Document, Schema, model } from "mongoose";

export type PaymentStatus = "pending" | "completed" | "failed";

export interface IPayment extends Document {
  payerName?: string;
  email: string;
  phone?: string;
  amount: number;
  currency?: string;
  reference: string;
  status: PaymentStatus;
  method?: string;
  meta?: any;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    payerName: { type: String },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: "NGN" },
    reference: { type: String, required: true, unique: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    method: { type: String },
    meta: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Payment = model<IPayment>("Payment", PaymentSchema);
