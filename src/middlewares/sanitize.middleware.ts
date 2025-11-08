import { Request, Response, NextFunction } from "express";

/**
 * Middleware custom untuk mencegah NoSQL Injection
 * tanpa menimpa req.query (Express 4.21+ bugfix)
 */
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  const sanitize = (obj: any) => {
    if (typeof obj !== "object" || obj === null) return;

    for (const key in obj) {
      if (/^\$/.test(key) || /\./.test(key)) {
        const safeKey = key.replace(/^\$+/g, "").replace(/\./g, "_");
        obj[safeKey] = obj[key];
        delete obj[key];
      }

      if (typeof obj[key] === "object") {
        sanitize(obj[key]);
      }
    }
  };

  // Hanya sanitize body dan params — bukan query (karena getter-only)
  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  next();
};
