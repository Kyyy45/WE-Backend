import express from "express";
import {
  enrollStudent,
  getMyEnrollments,
  updateProgress,
} from "../controllers/enrollment.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";
import { body, param } from "express-validator";
import { validate } from "../middlewares/validate";

const router = express.Router();

/**
 * Enrollment Routes
 * /api/v1/enrollments
 */

// Admin: Tambahkan student ke course
router.post(
  "/",
  verifyToken(),
  authorizeRoles("admin"),
  [
    body("courseId", "ID Kursus wajib diisi.")
      .notEmpty()
      .isMongoId()
      .withMessage("ID Kursus tidak valid."),
      
    body("studentId", "ID Siswa wajib diisi.")
      .notEmpty()
      .isMongoId()
      .withMessage("ID Siswa tidak valid."),
      
    body("customAnswers", "Data jawaban form tidak valid (harus array).")
      .optional()
      .isArray(),
  ],
  validate,
  enrollStudent
);

// Student: Lihat semua course yang diambil
router.get("/me", verifyToken(), authorizeRoles("student"), getMyEnrollments);

// Teacher: Update progress / nilai student
router.put(
  "/:id/progress",
  verifyToken(),
  authorizeRoles("teacher"),
  [
    param("id", "ID Pendaftaran (Enrollment ID) di URL tidak valid.")
      .isMongoId(),
      
    body("progress", "Progres harus berupa angka antara 0 dan 100.")
      .optional()
      .isNumeric({ no_symbols: true }) // 'isNumeric' mengizinkan angka, 'isInt' juga bisa
      .isInt({ min: 0, max: 100 }),
      
    body("grade", "Nilai harus berupa teks (contoh: 'A', 'B+').")
      .optional()
      .isString(),
      
    body("note", "Catatan harus berupa teks.")
      .optional()
      .isString(),
  ],
  validate,
  updateProgress
);

export default router;
