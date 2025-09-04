import { Request, Response } from "express";
import { Types } from "mongoose";
import { NewsLetter } from "../models/newsletter.model";
import { Subscriber } from "../models/subscriber.model";
import { sendEmail } from "../utils/email";

export async function getNewsLetters(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await NewsLetter.countDocuments().exec();

    const newsLetters = await NewsLetter.find()
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    const meta = {
      total,
      page,
      limit,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };

    return res.status(200).json({ data: newsLetters, meta });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Error fetching newsletters" });
  }
}

export async function getNewsLetter(req: Request, res: Response) {
  try {
    const newsLetterId = new Types.ObjectId(req.params.id);
    const newsLetter = await NewsLetter.findById(newsLetterId);
    return res.status(200).json(newsLetter);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Error fetching newsletter" });
  }
}

export async function createNewsLetter(req: Request, res: Response) {
  try {
    const { draftId, title, content } = req.body;

    const newsLetter = new NewsLetter({ draftId, title, content });
    await newsLetter.save();

    return res.status(201).json(newsLetter);
  } catch (err: any) {
    console.log(err);
    return res.status(500).json({ message: err.message || "Error creating newsletter" });
  }
}

export async function updateNewsLetter(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const newsLetter = await NewsLetter.findByIdAndUpdate(
      id,
      { title, content },
      { new: true }
    );

    if (!newsLetter) return res.status(404).json({ message: "Newsletter not found" });

    return res.status(200).json(newsLetter);
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Error updating newsletter" });
  }
}

export async function sendNewsLetter(req: Request, res: Response) {
  try {
    const newsLetterId = new Types.ObjectId(req.params.id);
    const newsLetter = await NewsLetter.findById(newsLetterId);

    const subscribers = await Subscriber.find({ status: "subscribed" }).exec();

    const subscribersEmails: string[] = [];
    subscribers.map((subscriber) => subscribersEmails.push(subscriber.email));

    await sendEmail({
      to: subscribersEmails,
      subject: newsLetter?.title!,
      html: newsLetter?.content,
    });

    return res.status(200).json({ ok: true });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Error sending newsletter" });
  }
}

export async function deleteNewsLetter(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const newsLetter = await NewsLetter.findOneAndDelete({ draftId: id });
    if (!newsLetter) return res.status(404).json({ message: "Newsletter not found" });

    return res.status(200).json({ message: "Newsletter deleted successfully" });
  } catch (err: any) {
    return res.status(500).json({ message: err.message || "Error deleting newsletter" });
  }
}
