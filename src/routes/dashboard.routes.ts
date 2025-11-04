// src/routes/dashboard.routes.ts
import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";
import { getDashboard } from "../controllers/dashboard.controller";
import { getDashboardAnalytics } from "../controllers/dashboardAnalytics.controller";

const router = express.Router();

// accessible for logged users
router.get("/", verifyToken(), getDashboard);

// analytics admin only
router.get("/analytics", verifyToken(), authorizeRoles("admin"), getDashboardAnalytics);

export default router;
