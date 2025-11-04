import { Request, Response } from "express";
import axios from "axios";
import crypto from "crypto";
import Transaction from "../models/transaction.model";
import Course from "../models/course.model";
import Enrollment from "../models/enrollment.model";
import { AuthenticatedRequest } from "../middlewares/verifyToken";
import { sendMail } from "../utils/sendEmail";
import { logger } from "../utils/logger";
import { setCache } from "../utils/dashboardCache";

const MIDTRANS_BASE_URL = process.env.MIDTRANS_BASE_URL!;
const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;
const CACHE_KEY_ANALYTICS = "dashboard:analytics";

/* -------------------------- AUTH HEADER (Midtrans) -------------------------- */
const getAuthHeader = () => {
  const base64 = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");
  return { Authorization: `Basic ${base64}` };
};

/* -------------------------- CREATE TRANSACTION -------------------------- */
export const createTransaction = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { courseId, paymentMethod = "qris", customAnswers } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const orderId = `ORDER-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const payload = {
    payment_type: paymentMethod,
    transaction_details: {
      order_id: orderId,
      gross_amount: course.price,
    },
    customer_details: {
      first_name: req.user.fullName,
      email: req.user.email,
    },
  };

  const { data } = await axios.post(`${MIDTRANS_BASE_URL}/charge`, payload, {
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
  });

  const transaction = await Transaction.create({
    student: req.user.id,
    course: course._id,
    amount: course.price,
    paymentMethod: paymentMethod.toUpperCase(),
    transactionId: orderId,
    qrCodeUrl:
      data.actions?.find((a: any) => a.name === "generate-qr-code")?.url ||
      null,
    status: "pending",
    description: `Payment for ${course.title}`,
    customAnswers: customAnswers || [],
  });

  return res.status(201).json({
    message: "Transaction created successfully",
    transaction,
    midtransResponse: data,
  });
};

/* -------------------------- CALLBACK MIDTRANS -------------------------- */
export const handleCallback = async (req: Request, res: Response) => {
  const {
    order_id,
    transaction_status,
    status_code,
    gross_amount,
    signature_key,
  } = req.body;

  const expectedSignature = crypto
    .createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
    .digest("hex");

  if (expectedSignature !== signature_key) {
    logger.warn("Invalid Midtrans signature");
    return res.status(403).json({ message: "Invalid signature" });
  }

  const transaction = await Transaction.findOne({ transactionId: order_id })
    .populate("student", "email fullName")
    .populate("course", "title price");

  if (!transaction)
    return res.status(404).json({ message: "Transaction not found" });

  let newStatus: "pending" | "success" | "failed" | "expired" = "pending";
  if (["settlement", "capture"].includes(transaction_status))
    newStatus = "success";
  else if (["deny", "cancel", "failure"].includes(transaction_status))
    newStatus = "failed";
  else if (transaction_status === "expire") newStatus = "expired";

  transaction.status = newStatus;
  await transaction.save();

  logger.info(`Payment ${order_id} updated to ${newStatus}`);

  /* Jika pembayaran sukses: auto-enroll dan kirim email */
  if (newStatus === "success") {
    const exists = await Enrollment.findOne({
      student: transaction.student,
      course: transaction.course,
    });

    if (!exists) {
      await Enrollment.create({
        student: transaction.student,
        course: transaction.course,
        progress: 0,
        grade: "",
        customAnswers: transaction.customAnswers || [],
      });

      await Course.findByIdAndUpdate(transaction.course, {
        $addToSet: { students: transaction.student },
      });

      // Kirim email ke student
      const email = (transaction.student as any).email;
      const fullName = (transaction.student as any).fullName;
      const courseTitle = (transaction.course as any).title;

      await sendMail(
        email,
        "Pembayaran Berhasil - Worldpedia Education",
        `<p>Halo ${fullName},</p>
           <p>Terima kasih! Pembayaran Anda untuk course <b>${courseTitle}</b> telah berhasil.</p>
           <p>Anda kini telah terdaftar pada course tersebut. Silakan login untuk mulai belajar.</p>`
      );

      logger.info(`Notifikasi pembayaran sukses dikirim ke ${email}`);
    }

    // Reset cache dashboard agar data transaksi ikut ter-update otomatis
    setCache(CACHE_KEY_ANALYTICS, null, 1);
  }

  return res.json({ message: "Callback processed", status: newStatus });
};

/* -------------------------- GET STUDENT TRANSACTIONS -------------------------- */
export const getMyTransactions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  const transactions = await Transaction.find({ student: req.user.id })
    .populate("course", "title price")
    .sort({ createdAt: -1 });
  return res.json({ transactions });
};
