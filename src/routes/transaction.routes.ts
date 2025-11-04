import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  createTransaction,
  getMyTransactions,
  handleCallback,
} from "../controllers/transaction.controller";

const router = express.Router();

// Student create payment
router.post("/", verifyToken(), createTransaction);
// Student get history
router.get("/me", verifyToken(), getMyTransactions);
// Payment callback from Midtrans
router.post("/callback", handleCallback);

export default router;
