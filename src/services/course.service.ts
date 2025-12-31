import { Course, ICourse } from "../models/course.model";

export interface CreateCourseInput {
  title: string;
  description?: string;
  instructor?: string;
  duration?: string;
  price?: number;
  priceUSD?: number;
  modules?: number;
  image?: string;
}

export async function createCourse(input: CreateCourseInput): Promise<ICourse> {
  const course = new Course({
    title: input.title,
    description: input.description,
    instructor: input.instructor,
    duration: input.duration,
    price: input.price,
    priceUSD: input.priceUSD,
    modules: input.modules,
    image: input.image,
  });

  return course.save();
}

export async function listCourses(opts?: { page?: number; limit?: number }) {
  const page = Math.max(1, opts?.page ?? 1);
  const limit = Math.max(1, Math.min(200, opts?.limit ?? 50));
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Course.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Course.countDocuments(),
  ]);

  return { items, total, page, limit };
}

export async function getCourseById(id: string) {
  return Course.findById(id);
}

export async function updateCourse(id: string, update: Partial<CreateCourseInput>) {
  return Course.findByIdAndUpdate(id, update, { new: true });
}

export async function deleteCourse(id: string) {
  return Course.findByIdAndDelete(id);
}
