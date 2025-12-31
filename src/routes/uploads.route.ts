import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { upload } from "../config/multer";
import { uploadImage } from "../controllers/upload.controller";

const router = Router();

router.post("/image", requireAuth, upload.single("file"), uploadImage);

export default router;
