import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // <-- Tidak ada error, lanjut ke controller
  }

  // <-- Ada error, kirim respons 400
  return res.status(400).json({
    message: 'Input tidak valid',
    errors: errors.array().map(err => ({
      field: (err as any).path,
      message: err.msg,
    }))
  });
};