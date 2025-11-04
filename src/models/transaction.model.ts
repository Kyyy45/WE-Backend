import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user.model";
import { ICourse } from "./course.model";
import { ICustomAnswer } from "./enrollment.model";

/**
 * Transaction Model — untuk mencatat pembayaran kursus
 */
export interface ITransaction extends Document {
  student: IUser["_id"];
  course: ICourse["_id"];
  amount: number;
  paymentMethod: "QRIS" | "BANK_TRANSFER" | "DANA";
  transactionId: string; // ORDER-ID (Midtrans)
  midtransTransactionId?: string; // ID unik dari Midtrans
  status: "pending" | "success" | "failed" | "expired";
  qrCodeUrl?: string;
  description?: string;
  customAnswers?: ICustomAnswer[];
  rawResponse?: any; // untuk simpan respon JSON dari Midtrans
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    amount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["QRIS", "BANK_TRANSFER", "DANA"],
      default: "QRIS",
    },
    transactionId: { type: String, required: true, unique: true },
    midtransTransactionId: { type: String },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "expired"],
      default: "pending",
    },
    qrCodeUrl: { type: String },
    description: { type: String },
    customAnswers: {
      type: [
        {
          fieldName: { type: String, required: true },
          value: { type: Schema.Types.Mixed, required: true },
        },
      ],
      default: [],
    },
    rawResponse: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export default mongoose.model<ITransaction>("Transaction", transactionSchema);
