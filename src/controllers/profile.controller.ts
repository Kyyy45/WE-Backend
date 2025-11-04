import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user.model";
import cloudinary from "../config/cloudinary";
import { logger } from "../utils/logger";
import multer from "multer";

/**
 * Konfigurasi multer untuk upload avatar
 */
const storage = multer.memoryStorage();
export const uploadAvatarMiddleware = multer({ storage }).single("avatar");

/**
 * Upload avatar ke Cloudinary dan langsung update profil user
 * Route: PUT /api/v1/profile/avatar
 */
export const uploadAndUpdateAvatar = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });
  if (!req.file?.buffer)
    return res.status(400).json({ message: "No file uploaded" });

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Hapus avatar lama jika ada
  if (user.avatarPublicId) {
    try {
      await cloudinary.uploader.destroy(user.avatarPublicId);
    } catch (error: any) {
      logger.warn("Gagal menghapus avatar lama: " + error.message);
    }
  }

  // Upload file baru ke Cloudinary
  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "worldpedia/avatars",
        resource_type: "image",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      },
      (error, result) => {
        if (error || !result) reject(error);
        else
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
      }
    );

    stream.end(req.file!.buffer);
  });

  // Simpan avatar baru ke database
  user.avatarUrl = uploadResult.secure_url;
  user.avatarPublicId = uploadResult.public_id;
  await user.save();

  return res.json({
    message: "Avatar uploaded & profile updated successfully",
    avatarUrl: user.avatarUrl,
  });
};

/**
 * GET /api/v1/profile
 * Mendapatkan data user yang sedang login
 */
export const getProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(req.user.id).select(
    "-password -refreshToken -activationToken -resetPasswordToken"
  );
  if (!user) return res.status(404).json({ message: "User not found" });

  return res.json(user);
};

/**
 * PUT /api/v1/profile
 * Update profil user (username, avatarUrl, dll)
 */
export const updateProfile = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { username, fullName, age, educationLevel, interests } = req.body;
  const updates: Record<string, any> = {};

  if (username) updates.username = username;
  if (fullName) updates.fullName = fullName;
  if (age) updates.age = age;
  if (educationLevel) updates.educationLevel = educationLevel;
  if (interests) updates.interests = interests;

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const updated = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
  }).select("-password");

  return res.json({ message: "Profile updated", user: updated });
};

/**
 * PUT /api/v1/profile/password
 * Ganti password user (dengan verifikasi password lama)
 */
export const changePassword = async (req: Request, res: Response) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");
  if (!user) return res.status(404).json({ message: "User not found" });

  const match = await bcrypt.compare(oldPassword, user.password!);
  if (!match)
    return res.status(400).json({ message: "Old password incorrect" });

  user.password = newPassword;
  await user.save();

  return res.json({ message: "Password updated successfully" });
};
