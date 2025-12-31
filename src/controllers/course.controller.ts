import { Request, Response } from "express";
import {
  createCourse,
  listCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../services/course.service";

export async function getCourses(req: Request, res: Response) {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const result = await listCourses({ page, limit });
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Get courses error:", err);
    return res.status(500).json({ message: err.message || "Error fetching courses" });
  }
}

export async function getCourse(req: Request, res: Response) {
  try {
    const course = await getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json(course);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Error fetching course" });
  }
}

export async function createCourseController(req: Request, res: Response) {
  try {
    const { title, description, instructor, duration, price, priceUSD, modules, image } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const created = await createCourse({ title, description, instructor, duration, price, priceUSD, modules, image });
    return res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Error creating course" });
  }
}

export async function updateCourseController(req: Request, res: Response) {
  try {
    const updated = await updateCourse(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json(updated);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Error updating course" });
  }
}

export async function deleteCourseController(req: Request, res: Response) {
  try {
    const deleted = await deleteCourse(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Course not found" });
    return res.status(200).json({ message: "Course deleted" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Error deleting course" });
  }
}
