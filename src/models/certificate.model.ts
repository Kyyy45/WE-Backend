import mongoose, { Schema, Document } from "mongoose";

export interface ICertificate extends Document {
  certificateId: string; // e.g. WPE-LTR-0001
  course: mongoose.Types.ObjectId;
  student: mongoose.Types.ObjectId;
  courseName: string;
  issuedAt: Date;
  certificateLink: string;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    certificateId: { type: String, unique: true, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseName: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
    certificateLink: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICertificate>("Certificate", CertificateSchema);
