import { Request, Response } from "express";
import cloudinary from "../utils/cloudinary";

export async function uploadImage(req: Request, res: Response) {
  try {
    // multer stores file buffer in req.file.buffer
    const file: any = (req as any).file;
    if (!file) return res.status(400).json({ message: "No file provided" });

    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: "courses" }, (error: any, result: any) => {
        if (error) return reject(error);
        resolve(result);
      });

      stream.end(file.buffer);
    });

    return res.status(201).json({ url: uploadResult.secure_url, raw: uploadResult });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: err.message || "Upload failed" });
  }
}
