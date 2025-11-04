import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { generateToken, hashToken } from "../utils/tokens";
import { sendMail } from "../utils/sendEmail";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshExpireMs,
} from "../utils/jwt";
import { getEnv } from "../utils/env";

const CLIENT_URL = getEnv("CLIENT_URL", "http://localhost:3000");

/* ----------------------------- Helpers ----------------------------- */
const setRefreshCookie = (res: Response, token: string) => {
  const secure = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: getRefreshExpireMs(),
    path: "/api/v1/auth",
  });
};

const clearRefreshCookie = (res: Response) => {
  res.clearCookie("refreshToken", { path: "/api/v1/auth" });
};

/* ----------------------------- REGISTER ----------------------------- */
export const register = async (req: Request, res: Response) => {
  const { fullName, username, email, password, confirmPassword } = req.body;

  const existingEmail = await User.findOne({ email });
  if (existingEmail)
    return res.status(400).json({ message: "Email already registered" });

  const existingUsername = await User.findOne({ username });
  if (existingUsername)
    return res.status(400).json({ message: "Username already taken" });

  const user = new User({ fullName, username, email, password });

  const rawActivation = await generateToken(24);
  user.activationToken = hashToken(rawActivation);
  user.activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 jam

  await user.save();

  const activationLink = `${CLIENT_URL}/activate?token=${rawActivation}&email=${encodeURIComponent(
    email
  )}`;
  await sendMail(
    email,
    "Aktivasi Akun Worldpedia Education",
    `<p>Halo ${fullName},</p>
       <p>Silakan klik link di bawah ini untuk mengaktifkan akun Anda (berlaku 24 jam):</p>
       <p><a href="${activationLink}">${activationLink}</a></p>`
  );

  return res
    .status(201)
    .json({ message: "Registered. Activation email sent." });
};

/* -------------------------- RESEND ACTIVATION ------------------------- */
export const resendActivation = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isVerified)
    return res.status(400).json({ message: "Account already activated" });

  const rawToken = await generateToken(24);
  user.activationToken = hashToken(rawToken);
  user.activationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const link = `${CLIENT_URL}/activate?token=${rawToken}&email=${encodeURIComponent(
    email
  )}`;
  await sendMail(
    email,
    "Aktivasi Akun - Worldpedia (Resend)",
    `<p>Klik link berikut untuk aktivasi ulang:</p><p><a href="${link}">${link}</a></p>`
  );

  return res.json({ message: "Activation email resent." });
};

/* ------------------------------- ACTIVATE ---------------------------- */
export const activate = async (req: Request, res: Response) => {
  const token = req.query.token as string;
  const email = req.query.email as string;
  if (!token || !email)
    return res.status(400).json({ message: "Invalid activation request" });

  const hashed = hashToken(token);
  const user = await User.findOne({
    email,
    activationToken: hashed,
    activationExpires: { $gt: new Date() },
  });

  if (!user)
    return res
      .status(400)
      .json({ message: "Invalid or expired activation token" });

  user.isVerified = true;
  user.activationToken = undefined;
  user.activationExpires = undefined;
  await user.save();

  return res.json({ message: "Account activated." });
};

/* ------------------------------- LOGIN ------------------------------- */
export const login = async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password)
    return res
      .status(400)
      .json({ message: "Email/Username & password required" });

  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  }).select("+password +refreshToken +refreshTokenExpires");

  if (!user) return res.status(404).json({ message: "User not found" });
  if (!user.isVerified)
    return res.status(403).json({ message: "Account not activated" });

  const ok = await bcrypt.compare(password, user.password || "");
  if (!ok) return res.status(400).json({ message: "Invalid credentials" });

  const payload = {
    id: String(user._id),
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = hashToken(refreshToken);
  user.refreshTokenExpires = new Date(Date.now() + getRefreshExpireMs());
  await user.save();

  setRefreshCookie(res, refreshToken);

  return res.json({
    message: "Login successful",
    accessToken,
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
};

/* ---------------------------- REFRESH TOKEN -------------------------- */
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string;
  if (!token)
    return res.status(401).json({ message: "No refresh token provided" });

  const decoded = verifyRefreshToken(token);
  if (!decoded || !decoded.id) {
    clearRefreshCookie(res);
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const user = await User.findById(decoded.id).select(
    "+refreshToken +refreshTokenExpires"
  );
  if (!user) {
    clearRefreshCookie(res);
    return res.status(401).json({ message: "Invalid token (user not found)" });
  }

  const hashed = hashToken(token);
  if (
    !user.refreshToken ||
    user.refreshToken !== hashed ||
    !user.refreshTokenExpires ||
    user.refreshTokenExpires < new Date()
  ) {
    user.refreshToken = undefined;
    user.refreshTokenExpires = undefined;
    await user.save().catch(() => {});
    clearRefreshCookie(res);
    return res
      .status(401)
      .json({ message: "Refresh token invalid or expired" });
  }

  const newPayload = {
    id: String(user._id),
    role: user.role,
    email: user.email,
    fullName: user.fullName,
  };
  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  user.refreshToken = hashToken(newRefreshToken);
  user.refreshTokenExpires = new Date(Date.now() + getRefreshExpireMs());
  await user.save();

  setRefreshCookie(res, newRefreshToken);

  return res.json({ accessToken: newAccessToken });
};

/* ------------------------------- LOGOUT ------------------------------ */
export const logout = async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (token) {
    try {
      const decoded = verifyRefreshToken(token);
      if (decoded?.id) {
        const user = await User.findById(decoded.id).select("+refreshToken");
        if (user) {
          user.refreshToken = undefined;
          user.refreshTokenExpires = undefined;
          await user.save().catch(() => {});
        }
      }
    } catch {
      // abaikan error token invalid
    }
  }

  clearRefreshCookie(res);
  return res.json({ message: "Logged out" });
};

/* ---------------------------- FORGOT PASSWORD ------------------------ */
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: "User not found" });

  const raw = await generateToken(24);
  user.resetPasswordToken = hashToken(raw);
  user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 menit
  await user.save();

  const link = `${CLIENT_URL}/reset-password?token=${raw}&email=${encodeURIComponent(
    email
  )}`;
  await sendMail(
    email,
    "Reset Password Worldpedia",
    `<p>Klik untuk reset password:</p><p><a href="${link}">${link}</a></p><p>Link berlaku 15 menit.</p>`
  );

  return res.json({ message: "Password reset link sent to email." });
};

/* ---------------------------- RESET PASSWORD ------------------------- */
export const resetPassword = async (req: Request, res: Response) => {
  const { email, token, newPassword } = req.body;

  const user = await User.findOne({ email }).select(
    "+password +resetPasswordToken +resetPasswordExpires"
  );
  if (!user) return res.status(404).json({ message: "User not found" });

  if (!user.resetPasswordToken || !user.resetPasswordExpires)
    return res.status(400).json({ message: "No reset request found" });

  if (
    user.resetPasswordToken !== hashToken(token) ||
    user.resetPasswordExpires < new Date()
  ) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // update password (Model akan auto-hash lewat pre('save'))
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  return res.json({ message: "Password updated successfully" });
};
