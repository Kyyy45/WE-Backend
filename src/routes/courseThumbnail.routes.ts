import express from "express";
import {
  uploadCourseThumbnail,
  deleteCourseThumbnail,
  uploadThumbnailMiddleware,
} from "../controllers/courseThumbnail.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";

const router = express.Router();

// 🔹 Upload / Replace thumbnail
router.post(
  "/:id/thumbnail",
  verifyToken(),
  authorizeRoles("admin"),
  uploadThumbnailMiddleware,
  uploadCourseThumbnail
);

// 🔹 Delete thumbnail only
router.delete(
  "/:id/thumbnail",
  verifyToken(),
  authorizeRoles("admin"),
  deleteCourseThumbnail
);

export default router;
