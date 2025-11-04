import express from "express";
import {
  getAllCertificates,
  getMyCertificates,
  getCertificateById,
} from "../controllers/certificate.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";

const router = express.Router();

// admin: lihat semua
router.get("/", verifyToken(), authorizeRoles("admin"), getAllCertificates);

// student: lihat sertifikat sendiri
router.get("/me", verifyToken(), authorizeRoles("student"), getMyCertificates);

// semua user login bisa lihat detail sertifikat
router.get("/:id", verifyToken(), getCertificateById);

export default router;
