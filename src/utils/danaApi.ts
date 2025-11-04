import axios from "axios";
import crypto from "crypto";
import { getEnv } from "../utils/env";

const BASE_URL = getEnv("DANA_BASE_URL");
const CLIENT_ID = getEnv("DANA_CLIENT_ID");
const CLIENT_SECRET = getEnv("DANA_CLIENT_SECRET");
const API_KEY = getEnv("DANA_API_KEY");

/**
 * Generate signature untuk autentikasi request DANA
 */
export const generateSignature = (body: object): string => {
  const payload = JSON.stringify(body);
  return crypto.createHmac("sha256", CLIENT_SECRET).update(payload).digest("hex");
};

/**
 * Membuat transaksi QRIS / VA di DANA
 */
export const createDanaPayment = async (params: {
  orderId: string;
  amount: number;
  method: "QRIS" | "VA";
  callbackUrl: string;
}) => {
  const body = {
    orderId: params.orderId,
    amount: params.amount,
    method: params.method,
    currency: "IDR",
    callbackUrl: params.callbackUrl,
  };

  const signature = generateSignature(body);

  const response = await axios.post(`${BASE_URL}/v1/payments`, body, {
    headers: {
      "x-client-id": CLIENT_ID,
      "x-signature": signature,
      "x-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
