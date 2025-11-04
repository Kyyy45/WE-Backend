import mongoose, { Schema, Document } from "mongoose";

export type FormFieldType = "text" | "email" | "number" | "select" | "textarea" | "checkbox";

export interface IFormField {
  name: string;
  label?: string;
  type: FormFieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // untuk select / checkbox
}

export interface ICourse extends Document {
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  thumbnailUrl?: string;
  thumbnailPublicId?: string;
  certificateFolderLink?: string;
  teacher: mongoose.Types.ObjectId; // assigned by admin (role=teacher)
  students: mongoose.Types.ObjectId[]; // optional quick relation (can be used or sync with Enrollment)
  price: number;
  currency?: string;
  category?: string;
  formFields?: IFormField[]; // custom registration form per course
  targetAgeRange?: {
    min: number;
    max: number;
  };
  targetEducationLevel?: string; // e.g. "SD", "SMP", "SMA", "Mahasiswa"
  targetInterests?: string[]
  syllabus?: {
    order: number;
    title: string;
    description?: string;
    contentUrl?: string;
  }[];
  isPublished: boolean;
  totalLessons?: number;
  createdAt: Date;
  updatedAt: Date;
}

const FormFieldSchema = new Schema<IFormField>(
  {
    name: { type: String, required: true },
    label: { type: String },
    type: { type: String, enum: ["text","email","number","select","textarea","checkbox"], required: true },
    required: { type: Boolean, default: false },
    placeholder: { type: String },
    options: [{ type: String }],
  },
  { _id: false }
);

const SyllabusSchema = new Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String },
    contentUrl: { type: String },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    shortDescription: { type: String, maxlength: 300 },
    description: { type: String },
    thumbnailUrl: { type: String },
    thumbnailPublicId: { type: String },
    certificateFolderLink: { type: String },
    teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "User" }],
    price: { type: Number, default: 0 },
    currency: { type: String, default: "IDR" },
    category: { type: String, index: true },
    formFields: { type: [FormFieldSchema], default: [] },
    syllabus: { type: [SyllabusSchema], default: [] },
    isPublished: { type: Boolean, default: false },
    totalLessons: { type: Number, default: 0 },

    targetAgeRange: {
      min: { type: Number },
      max: { type: Number },
    },
    targetEducationLevel: { type: String },
    targetInterests: [{ type: String }],
  },
  { timestamps: true }
);

// text index for search
CourseSchema.index({ title: "text", shortDescription: "text", category: "text" });

export default mongoose.model<ICourse>("Course", CourseSchema);
