import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import {
  getProfile,
  updateProfile,
  changePassword,
  uploadAndUpdateAvatar,
  uploadAvatarMiddleware,
} from "../controllers/profile.controller";
import { body } from "express-validator";
import { validate } from "../middlewares/validate";

const router = express.Router();

const passwordRules = (fieldName: string) =>
  body(fieldName)
    .isLength({ min: 8 })
    .withMessage(`${fieldName} minimal 8 karakter`)
    .matches(/(?=.*[A-Z])/)
    .withMessage(`${fieldName} harus mengandung 1 huruf kapital`)
    .matches(/(?=.*\d)/)
    .withMessage(`${fieldName} harus mengandung 1 angka`)
    .matches(/(?=.*[!@#$%^&*])/)
    .withMessage(`${fieldName} harus mengandung 1 simbol (!@#$%^&*)`);

/**
 * GET /api/v1/profile
 * Ambil data profil user yang sedang login
 */
router.get("/", verifyToken(), getProfile);

/**
 * PUT /api/v1/profile
 * Update profil user (username, avatarUrl, dsb)
 */
router.put(
  "/",
  verifyToken(),
  [
    body("fullName", "Nama lengkap harus berupa teks, minimal 3 karakter.")
      .optional()
      .isString()
      .isLength({ min: 3 }),
    body("username", "Username harus berupa teks, minimal 3 karakter.")
      .optional()
      .isString()
      .isLength({ min: 3 })
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage("Username hanya boleh berisi huruf, angka, dan underscore"),
    
    // Validasi untuk data rekomendasi
    body("age", "Usia harus berupa angka.")
      .optional({ nullable: true })
      .isInt({ min: 0 }),
    body("educationLevel", "Tingkat pendidikan harus berupa teks.")
      .optional({ nullable: true })
      .isString(),
    body("interests", "Minat harus berupa array teks.")
      .optional({ nullable: true })
      .isArray(),
    body("interests.*", "Setiap minat harus berupa teks.")
      .optional()
      .isString(),
  ],
  validate,
  updateProfile
);

/**
 * PUT /api/v1/profile/password
 * Ganti password dengan verifikasi password lama
 */
router.put(
  "/password",
  verifyToken(),
  [
    body("oldPassword", "Password lama wajib diisi.").notEmpty(),
    
    passwordRules("newPassword"), 
  ],
  validate,
  changePassword
);

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
