import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import {
  createCourseController,
  deleteCourseController,
  getCourse,
  getCourses,
  updateCourseController,
} from "../controllers/course.controller";

const router = Router();

// Public endpoints
router.get("/", getCourses);
router.get("/:id", getCourse);
router.post("/", requireAuth, createCourseController);
router.put("/:id", requireAuth, updateCourseController);
router.delete("/:id", requireAuth, deleteCourseController);

export default router;
