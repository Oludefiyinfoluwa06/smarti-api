import { Schema, model, Document } from "mongoose";

export interface INewsLetter extends Document {
  draftId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewsLetterSchema = new Schema<INewsLetter>(
  {
    draftId: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String },
  },
  { timestamps: true }
);

export const NewsLetter = model<INewsLetter>("NewsLetter", NewsLetterSchema);
