import express from "express";
import {
  getAllCertificates,
  getMyCertificates,
  getCertificateById,
} from "../controllers/certificate.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";
import { param } from "express-validator"; 
import { validate } from "../middlewares/validate";

const router = express.Router();

// admin: lihat semua
router.get("/", verifyToken(), authorizeRoles("admin"), getAllCertificates);

// student: lihat sertifikat sendiri
router.get("/me", verifyToken(), authorizeRoles("student"), getMyCertificates);

// semua user login bisa lihat detail sertifikat
router.get(
  "/:id",
  verifyToken(),
  [ // <-- 3. Tambahkan validasi untuk 'id'
    param("id", "ID Sertifikat tidak boleh kosong.").notEmpty().isString(),
  ],
  validate, // <-- 4. Terapkan middleware validate
  getCertificateById
);

export default router;
