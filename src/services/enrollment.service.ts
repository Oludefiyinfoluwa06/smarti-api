import { Enrollment, IEnrollment } from "../models/enrollment.model";

export async function createEnrollment(payload: Partial<IEnrollment>) {
  const created = await Enrollment.create(payload);
  return created;
}

export type ListEnrollmentsOpts = {
  page?: number;
  limit?: number;
};

export async function listEnrollments(opts?: ListEnrollmentsOpts) {
  const page = opts?.page && opts.page > 0 ? opts.page : 1;
  const limit = opts?.limit && opts.limit > 0 ? opts.limit : 50;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Enrollment.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Enrollment.countDocuments(),
  ]);

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getEnrollmentById(id: string) {
  return Enrollment.findById(id).lean();
}

export type EnrollmentCount = { courseId: string; enrollments: number; seats: number };

export async function getEnrollmentCounts(courseIds?: string[]): Promise<EnrollmentCount[]> {
  const pipeline: any[] = [
    { $unwind: "$courseItems" },
  ];

  if (courseIds && courseIds.length > 0) {
    pipeline.push({ $match: { "courseItems.courseId": { $in: courseIds } } });
  }

  // First group by course+enrollment to sum seats per enrollment
  pipeline.push({
    $group: {
      _id: { courseId: "$courseItems.courseId", enrollmentId: "$_id" },
      seats: { $sum: "$courseItems.qty" },
    },
  });

  // Then group by courseId to count enrollments and sum seats
  pipeline.push({
    $group: {
      _id: "$_id.courseId",
      enrollments: { $sum: 1 },
      seats: { $sum: "$seats" },
    },
  });

  const results = await Enrollment.aggregate(pipeline).exec();

  return results.map((r: any) => ({ courseId: r._id, enrollments: r.enrollments || 0, seats: r.seats || 0 }));
}
