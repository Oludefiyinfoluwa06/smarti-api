import multer from "multer";

// Use memory storage so we can stream to Cloudinary without saving to disk
const storage = multer.memoryStorage();

export const upload = multer({ storage });
