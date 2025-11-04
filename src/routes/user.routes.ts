import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";
import { validate } from "../middlewares/validate";
import { body, param } from "express-validator";
import { getAllUsers, updateUserRole, deactivateUser } from "../controllers/user.controller";

const router = Router();

/**
 * Rute ini HANYA untuk Admin.
 * Base path: /api/v1/users
 */

// GET /api/v1/users - (Admin melihat semua user)
router.get(
  "/",
  verifyToken(),
  authorizeRoles("admin"),
  getAllUsers
);

// PUT /api/v1/users/:id/role - (Admin mengubah role user)
router.put(
  "/:id/role",
  verifyToken(),
  authorizeRoles("admin"),
  [
    param("id", "ID User tidak valid").isMongoId(),
    body("role", "Role tidak valid")
      .notEmpty()
      // Pastikan Admin hanya bisa assign role yang ada di model Anda
      .isIn(["admin", "teacher", "student"]) 
      .withMessage("Role hanya boleh 'admin', 'teacher', atau 'student'"),
  ],
  validate,
  updateUserRole
);

router.delete(
  "/:id",
  verifyToken(),
  authorizeRoles("admin"),
  [
    param("id", "ID User tidak valid").isMongoId(),
  ],
  validate,
  deactivateUser
);

export default router;