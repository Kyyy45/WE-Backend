import mongoose, { Schema, Document } from "mongoose";

/**
 * Representasi field hasil pengisian form oleh student
 */
export interface ICustomAnswer {
  fieldName: string;
  value: string | number | boolean;
}

/**
 * Model Enrollment
 * Menyimpan data pendaftaran course oleh student
 */
export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  progress: number; // 0–100 (%)
  grade?: string; // nilai huruf/angka
  note?: string; // catatan teacher
  customAnswers?: ICustomAnswer[];
  enrolledAt: Date;
  updatedAt: Date;
}

const CustomAnswerSchema = new Schema<ICustomAnswer>(
  {
    fieldName: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    grade: { type: String },
    note: { type: String },
    customAnswers: { type: [CustomAnswerSchema], default: [] },
  },
  { timestamps: { createdAt: "enrolledAt", updatedAt: "updatedAt" } }
);

// Cegah duplikasi student dalam 1 course
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);
