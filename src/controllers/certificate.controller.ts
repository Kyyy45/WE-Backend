import { Response } from "express";
import Certificate from "../models/certificate.model";
import { AuthenticatedRequest } from "../middlewares/verifyToken";
import mongoose from "mongoose";

/**
 * GET /api/v1/certificates (Admin only)
 */
export const getAllCertificates = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const certs = await Certificate.find()
    .populate("course", "title slug")
    .populate("student", "fullName username email");
  res.json(certs);
};

/**
 * GET /api/v1/certificates/me (Student only)
 */
export const getMyCertificates = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const certs = await Certificate.find({ student: req.user.id })
    .populate("course", "title slug")
    .sort({ issuedAt: -1 });

  res.json(certs);
};

/**
 * GET /api/v1/certificates/:id (Logged users)
 */
export const getCertificateById = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { id } = req.params;

  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id } // Jika formatnya MongoID, cari berdasarkan _id
    : { certificateId: id }; // Jika bukan, cari berdasarkan certificateId

  const cert = await Certificate.findById(req.params.id)
    .populate("course", "title slug")
    .populate("student", "fullName username email");

  if (!cert) return res.status(404).json({ message: "Certificate not found" });

  const user = req.user;
  if (
    user?.role !== "admin" && // Jika bukan admin
    cert.student._id.toString() !== user?.id // Dan bukan pemilik sertifikat
  ) {
    return res
      .status(403)
      .json({
        message: "Forbidden: Anda tidak memiliki akses ke sertifikat ini.",
      });
  }

  res.json(cert);
};
