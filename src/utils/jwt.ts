import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import ms from "ms";
import dotenv from "dotenv";

dotenv.config();

/**
 * Environment variables
 */
const JWT_SECRET = process.env.JWT_SECRET ?? "";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as ms.StringValue;
const JWT_REFRESH_EXPIRE = (process.env.JWT_REFRESH_EXPIRE ?? "7d") as ms.StringValue;

/**
 * Token payload type
 */
export interface TokenPayload {
  id: string;
  email: string;
  role?: string;
  fullName?: string; // ✅ tambahkan agar ikut dikirim di JWT
}

/**
 * Generate Access Token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: JWT_REFRESH_EXPIRE };
  return jwt.sign(payload, JWT_REFRESH_SECRET, options);
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload; // ✅ ubah ke TokenPayload
  } catch {
    return null;
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload; // ✅ ubah juga
  } catch {
    return null;
  }
};

/**
 * Decode token tanpa verifikasi
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch {
    return null;
  }
};

/**
 * Hitung waktu kedaluwarsa refresh token (ms)
 */
export const getRefreshExpireMs = (): number => {
  try {
    const value = ms(JWT_REFRESH_EXPIRE);
    return typeof value === "number" ? value : 7 * 24 * 60 * 60 * 1000; // fallback 7 hari
  } catch {
    return 7 * 24 * 60 * 60 * 1000;
  }
};
