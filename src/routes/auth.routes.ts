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
import { body } from "express-validator";
import { validate } from "../middlewares/validate";

const router = Router();

const passwordRules = (fieldName: string) =>
  body(fieldName)
    .isLength({ min: 8 })
    .withMessage(`${fieldName} minimal 8 karakter`)
    .matches(/(?=.*[A-Z])/)
    .withMessage(`${fieldName} harus mengandung 1 huruf kapital`)
    .matches(/(?=.*\d)/)
    .withMessage(`${fieldName} harus mengandung 1 angka`)
    .matches(/(?=.*[!@#$%^&*])/)
    .withMessage(`${fieldName} harus mengandung 1 simbol (!@#$%^&*)`);

/* ----------------------------- REGISTER ----------------------------- */
router.post(
  "/register",
  [
    body("fullName", "Nama lengkap wajib diisi").notEmpty().isLength({ min: 3 }),
    body("username", "Username minimal 3 karakter").notEmpty().isLength({ min: 3 }),
    body("email", "Format email tidak valid").isEmail(),
    
    passwordRules("password"),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Konfirmasi password tidak cocok");
      }
      return true;
    }),
  ],
  validate, // Middleware yang menangani error validasi
  register
);

/* -------------------------- RESET PASSWORD -------------------------- */
router.post(
  "/reset-password",
  [
    body("email", "Email tidak valid").isEmail(),
    body("token", "Token wajib diisi").notEmpty(),

    passwordRules("newPassword"),

    body("confirmNewPassword").custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error("Konfirmasi password baru tidak cocok");
      }
      return true;
    }),
  ],
  validate,
  resetPassword
);

/* -------------------------- RUTE LAINNYA -------------------------- */
router.post(
  "/login",
  [
    body("emailOrUsername", "Email/Username wajib diisi").notEmpty(),
    body("password", "Password wajib diisi").notEmpty(),
  ],
  validate,
  login
);

router.get("/activate", activate);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

router.post(
  "/forgot-password",
  [body("email", "Email tidak valid").isEmail()],
  validate,
  forgotPassword
);

router.post(
  "/resend-activation",
  [body("email", "Email tidak valid").isEmail()],
  validate,
  resendActivation
);

export default router;