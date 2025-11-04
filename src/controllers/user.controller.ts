import { Request, Response } from "express";
import User from "../models/user.model";
import { AuthenticatedRequest } from "../middlewares/verifyToken";

/**
 * [ADMIN] Melihat daftar semua pengguna (dengan pagination)
 */
export const getAllUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-password -refreshToken -activationToken -resetPasswordToken")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
  const totalUsers = await User.countDocuments();

  res.json({
    data: users,
    meta: {
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
    },
  });
};

/**
 * [ADMIN] Memperbarui role seorang pengguna
 */
export const updateUserRole = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params; // ID user yang akan diubah
  const { role } = req.body; // Role baru ("admin", "teacher", "student")
  
  // (Opsional) Mencegah admin mengubah role-nya sendiri secara tidak sengaja
  if (req.user?.id === id) {
     return res.status(400).json({ message: "Anda tidak dapat mengubah role Anda sendiri melalui endpoint ini." });
  }

  const userToUpdate = await User.findById(id);
  if (!userToUpdate) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  userToUpdate.role = role;
  await userToUpdate.save();

  res.json({
    message: `Role untuk ${userToUpdate.username} berhasil diubah menjadi ${role}`,
    user: {
      id: userToUpdate._id,
      username: userToUpdate.username,
      email: userToUpdate.email,
      role: userToUpdate.role,
    },
  });
};

/**
 * [ADMIN] Menonaktifkan (soft delete) akun pengguna
 */
export const deactivateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params; // ID user yang akan dinonaktifkan

  // Mencegah admin menonaktifkan akunnya sendiri
  if (req.user?.id === id) {
     return res.status(400).json({ message: "Anda tidak dapat menonaktifkan akun Anda sendiri." });
  }

  const userToDeactivate = await User.findById(id);
  if (!userToDeactivate) {
    return res.status(404).json({ message: "User tidak ditemukan" });
  }

  // Lakukan Soft Delete
  userToDeactivate.isDeactivated = true;
  userToDeactivate.email = `deactivated_${Date.now()}_${userToDeactivate.email}`; // Ubah email agar bisa dipakai lagi
  userToDeactivate.username = `deactivated_${Date.now()}_${userToDeactivate.username}`; // Ubah username
  userToDeactivate.refreshToken = undefined; // Hapus token
  userToDeactivate.activationToken = undefined;
  userToDeactivate.resetPasswordToken = undefined;
  
  await userToDeactivate.save();

  res.json({
    message: `Akun untuk ${userToDeactivate.username} telah berhasil dinonaktifkan.`,
  });
};