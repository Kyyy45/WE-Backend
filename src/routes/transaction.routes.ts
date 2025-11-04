import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  createTransaction,
  getMyTransactions,
  handleCallback,
} from "../controllers/transaction.controller";
import { body } from "express-validator";
import { validate } from "../middlewares/validate";

const router = express.Router();

// Student create payment
router.post(
  "/",
  verifyToken(),
  [
    body("courseId", "ID Kursus wajib diisi").notEmpty().isMongoId(),
    body("paymentMethod", "Metode pembayaran tidak valid").optional().isString(),
    
    // --- Validasi untuk Jawaban Form ---
    body("customAnswers", "Data jawaban form tidak valid (harus array).")
      .optional()
      .isArray(),
    body("customAnswers.*.fieldName", "Nama field di jawaban tidak boleh kosong.")
      .optional()
      .isString()
      .notEmpty(),
  ],
  validate,
  createTransaction
);

// Student get history
router.get("/me", verifyToken(), getMyTransactions);

// Payment callback from Midtrans
router.post("/callback", handleCallback);

export default router;