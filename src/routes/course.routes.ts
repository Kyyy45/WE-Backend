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

const router = express.Router();

// Admin only
router.post("/", verifyToken(), authorizeRoles("admin"), createCourse);
router.put("/:id", verifyToken(), authorizeRoles("admin"), updateCourse);
router.delete("/:id", verifyToken(), authorizeRoles("admin"), deleteCourse);

// Logged users & guest
router.get("/", verifyToken(false), listCourses);
router.get("/:id", verifyToken(false), getCourseById);

export default router;
