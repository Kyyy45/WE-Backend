import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

/**
 * Struktur user yang ter-embed di token JWT
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role?: string;
  fullName?: string;
}

/**
 * Request yang sudah di-authenticate (menyertakan user)
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/**
 * Middleware untuk verifikasi JWT (Bearer Token)
 * - Jika required = true (default), token wajib ada.
 * - Jika required = false, route bisa diakses tanpa login.
 */
export const verifyToken = (required: boolean = true) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        if (!required) return next(); // izinkan akses publik
        return res.status(401).json({ message: "No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = verifyAccessToken(token) as AuthenticatedUser | null;

      if (!decoded?.id || !decoded?.email) {
        if (!required) return next();
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        fullName: decoded.fullName,
      };

      next();
    } catch (err) {
      if (!required) return next();
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
