import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createNewsLetter,
  deleteNewsLetter,
  getNewsLetter,
  getNewsLetters,
  sendNewsLetter,
  updateNewsLetter,
} from "../controllers/newsletter.controller";

const router = Router();

router.get("/", requireAuth, getNewsLetters);
router.get("/:id", requireAuth, getNewsLetter);
router.post("/", requireAuth, createNewsLetter);
router.put("/:id", requireAuth, updateNewsLetter);
router.post("/:id", requireAuth, sendNewsLetter);
router.delete("/:id", requireAuth, deleteNewsLetter);

export default router;
