import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./verifyToken";

/**
 * Middleware otorisasi berdasarkan role.
 * Contoh: authorizeRoles("admin", "teacher")
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: no user data" });
    }

    const userRole = req.user.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }

    next();
  };
};
