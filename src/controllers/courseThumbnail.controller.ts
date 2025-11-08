import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import Course from "../models/course.model";
import multer from "multer";
import { logger } from "../utils/logger";

const storage = multer.memoryStorage();
const MAX_THUMBNAIL_SIZE = 10 * 1024 * 1024;

const imageFileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Upload gagal: Hanya file gambar yang diizinkan!") as any, false);
  }
};

export const uploadThumbnailMiddleware = multer({
  storage: storage,
  limits: { fileSize: MAX_THUMBNAIL_SIZE },
  fileFilter: imageFileFilter
}).single("thumbnail");

/**
 * Upload thumbnail baru (admin only)
 */
export const uploadCourseThumbnail = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  // Hapus thumbnail lama jika ada
  if (course.thumbnailPublicId) {
    try {
      await cloudinary.uploader.destroy(course.thumbnailPublicId);
    } catch (error: any) {
      logger.warn("Failed to delete old thumbnail: " + error.message);
    }
  }

  // Upload baru ke Cloudinary
  const uploadResult = await new Promise<{
    secure_url: string;
    public_id: string;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "worldpedia/courses",
        resource_type: "image",
        transformation: [{ width: 800, height: 450, crop: "fill" }],
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

  course.thumbnailUrl = uploadResult.secure_url;
  course.thumbnailPublicId = uploadResult.public_id;
  await course.save();

  return res.json({
    message: "Thumbnail uploaded successfully",
    thumbnailUrl: uploadResult.secure_url,
  });
};

/**
 * Hapus thumbnail dari Cloudinary dan DB (admin only)
 */
export const deleteCourseThumbnail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const course = await Course.findById(id);
  if (!course) return res.status(404).json({ message: "Course not found" });

  if (!course.thumbnailPublicId) {
    return res.status(400).json({ message: "No thumbnail to delete" });
  }

  await cloudinary.uploader.destroy(course.thumbnailPublicId);

  course.thumbnailUrl = undefined;
  course.thumbnailPublicId = undefined;
  await course.save();

  return res.json({ message: "Thumbnail deleted successfully" });
};
