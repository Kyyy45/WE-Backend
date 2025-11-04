import express from "express";
import {
  enrollStudent,
  getMyEnrollments,
  updateProgress,
} from "../controllers/enrollment.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";

const router = express.Router();

/**
 * 🔹 Enrollment Routes
 * /api/v1/enrollments
 */

// ✅ Admin: Tambahkan student ke course
router.post("/", verifyToken(), authorizeRoles("admin"), enrollStudent);

// ✅ Student: Lihat semua course yang diambil
router.get("/me", verifyToken(), authorizeRoles("student"), getMyEnrollments);

// ✅ Teacher: Update progress / nilai student
router.put("/:id/progress", verifyToken(), authorizeRoles("teacher"), updateProgress);

export default router;
