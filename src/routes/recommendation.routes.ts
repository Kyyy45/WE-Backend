import express from "express";
import { getRecommendations } from "../controllers/recommendation.controller";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleAuth.middleware";

const router = express.Router();

router.get("/", verifyToken(), authorizeRoles("student"), getRecommendations);

export default router;
