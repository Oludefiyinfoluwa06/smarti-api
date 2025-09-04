import { Schema, model, Document } from "mongoose";

export type SubscriberStatus = "pending" | "subscribed" | "unsubscribed";

export interface ISubscriber extends Document {
  email: string;
  name?: string;
  status: SubscriberStatus;
  confirmToken?: string | null;
  confirmExpiresAt?: Date | null;
  unsubToken?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriberSchema = new Schema<ISubscriber>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "subscribed", "unsubscribed"],
      default: "pending",
    },
    confirmToken: {
      type: String
    },
    confirmExpiresAt: {
      type: Date
    },
    unsubToken: {
      type: String
    },
  },
  { timestamps: true }
);

SubscriberSchema.index({ email: 1 }, { unique: true });

export const Subscriber = model<ISubscriber>("Subscriber", SubscriberSchema);
