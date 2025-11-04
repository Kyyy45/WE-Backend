import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAndUpdateAvatar,
  uploadAvatarMiddleware,
} from "../controllers/profile.controller";

const router = express.Router();

/**
 * GET /api/v1/profile
 * Ambil data profil user yang sedang login
 */
router.get("/", verifyToken(), getProfile);

/**
 * PUT /api/v1/profile
 * Update profil user (username, avatarUrl, dsb)
 */
router.put("/", verifyToken(), updateProfile);

/**
 * PUT /api/v1/profile/password
 * Ganti password dengan verifikasi password lama
 */
router.put("/password", verifyToken(), changePassword);

/**
 * PUT /api/v1/profile/avatar
 * Upload avatar (form-data) ke Cloudinary + update user.avatarUrl otomatis
 * Gunakan form-data → key: "avatar", type: File
 */
router.put(
  "/avatar",
  verifyToken(),
  uploadAvatarMiddleware, // middleware multer untuk handle file
  uploadAndUpdateAvatar   // controller upload Cloudinary + update DB
);

export default router;
