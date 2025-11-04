import { Router } from "express";
import {
  register,
  resendActivation,
  activate,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller";

const router = Router();

router.post("/register", register);
router.post("/resend-activation", resendActivation);
router.get("/activate", activate);

router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
