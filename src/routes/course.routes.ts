import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseById,
  listCourses,
} from "../controllers/course.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";
import { body, param, query } from "express-validator";
import { validate } from "../middlewares/validate"; 

const router = express.Router();

// === RUTE ADMIN ===

router.post(
  "/",
  verifyToken(),
  authorizeRoles("admin"),
  [
    // Validasi Data Kursus Dasar
    body("title", "Judul kursus wajib diisi.").notEmpty().isString(),
    body("teacherId")
      .notEmpty().withMessage("Anda harus memilih seorang guru.")
      .isMongoId().withMessage("Pilihan guru tidak valid."),
    body("price", "Harga harus dalam format angka (contoh: 50000).")
      .optional()
      .isNumeric(),
      
    // --- Validasi Baru untuk Data Rekomendasi ---
    body("targetEducationLevel", "Tingkat pendidikan harus berupa teks (contoh: 'SMA').")
      .optional()
      .isString(),
      
    body("targetInterests", "Minat harus berupa array (contoh: ['Sains', 'Matematika']).")
      .optional()
      .isArray(),
    body("targetInterests.*", "Setiap minat harus berupa teks.") // Validasi setiap item di dalam array
      .optional()
      .isString(),
      
    body("targetAgeRange", "Rentang usia harus berupa objek (contoh: { min: 7, max: 12 }).")
      .optional()
      .isObject(),
    body("targetAgeRange.min", "Usia minimum harus berupa angka.")
      .optional()
      .isInt({ min: 0 }),
    body("targetAgeRange.max", "Usia maksimum harus berupa angka.")
      .optional()
      .isInt({ min: 1 })
      .custom((value, { req }) => {
        // Pastikan 'max' lebih besar atau sama dengan 'min'
        if (req.body.targetAgeRange?.min && value < req.body.targetAgeRange.min) {
          throw new Error("Usia maksimum harus lebih besar dari usia minimum.");
        }
        return true;
      }),
    // ---------------------------------------------
  ],
  validate, 
  createCourse
);

router.put(
  "/:id",
  verifyToken(),
  authorizeRoles("admin"),
  [
    param("id", "ID kursus di URL tidak valid.").isMongoId(),
    
    // Validasi Data Kursus Dasar
    body("title", "Judul tidak boleh kosong.")
      .optional()
      .isString()
      .notEmpty(),
    body("teacherId", "Pilihan guru tidak valid.")
      .optional()
      .isMongoId(),
    
    // --- Validasi Baru untuk Data Rekomendasi (Update) ---
    body("targetEducationLevel", "Tingkat pendidikan harus berupa teks.")
      .optional({ nullable: true }) // 'nullable' berarti boleh dikirim sebagai 'null'
      .isString(),
      
    body("targetInterests", "Minat harus berupa array.")
      .optional({ nullable: true })
      .isArray(),
    body("targetInterests.*", "Setiap minat harus berupa teks.")
      .optional()
      .isString(),
      
    body("targetAgeRange", "Rentang usia harus berupa objek.")
      .optional({ nullable: true })
      .isObject(),
    body("targetAgeRange.min", "Usia minimum harus berupa angka.")
      .optional()
      .isInt({ min: 0 }),
    body("targetAgeRange.max", "Usia maksimum harus berupa angka.")
      .optional()
      .isInt({ min: 1 })
      .custom((value, { req }) => {
        if (req.body.targetAgeRange?.min && value < req.body.targetAgeRange.min) {
          throw new Error("Usia maksimum harus lebih besar dari usia minimum.");
        }
        return true;
      }),
    // ---------------------------------------------
  ],
  validate, 
  updateCourse
);

router.delete(
  "/:id",
  verifyToken(),
  authorizeRoles("admin"),
  [
    param("id", "ID kursus di URL tidak valid.").isMongoId(),
  ],
  validate,
  deleteCourse
);

// === RUTE PUBLIK & USER ===

router.get(
  "/",
  verifyToken(false),
  [
    query("page", "Nomor halaman tidak valid.").optional().isInt({ min: 1 }),
    query("limit", "Jumlah item per halaman tidak valid.").optional().isInt({ min: 1, max: 100 }),
    query("minPrice", "Format harga minimum tidak valid.").optional().isNumeric(),
    query("maxPrice", "Format harga maksimum tidak valid.").optional().isNumeric(),
  ],
  validate,
  listCourses
);

router.get(
  "/:id",
  verifyToken(false),
  [ 
    param("id", "ID atau slug kursus tidak boleh kosong.").isString().notEmpty(),
  ],
  validate,
  getCourseById
);

export default router;