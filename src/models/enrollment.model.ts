import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseItem {
  courseId: string;
  courseTitle?: string;
  qty: number;
}

export interface IEnrollment extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  courseItems: ICourseItem[];
  totalAmount: number;
  paymentReference?: string;
  paymentStatus?: string;
  meetingId?: string;
  meetingJoinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseItemSchema = new Schema<ICourseItem>({
  courseId: { type: String, required: true },
  courseTitle: { type: String },
  qty: { type: Number, required: true, default: 1 },
});

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    courseItems: { type: [CourseItemSchema], required: true, default: [] },
    totalAmount: { type: Number, required: true, default: 0 },
    paymentReference: { type: String, index: true, unique: false },
    paymentStatus: { type: String, default: 'pending' },
    meetingId: { type: String },
    meetingJoinUrl: { type: String },
  },
  { timestamps: true }
);

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);

export default Enrollment;
