import { Request, Response } from "express";
import Course from "../models/course.model";
import User from "../models/user.model";
import { AuthenticatedRequest } from "../middlewares/verifyToken";
import { logger } from "../utils/logger";

/**
 * GET /api/v1/recommendations
 * Menghasilkan rekomendasi course berdasarkan profil student
 */
export const getRecommendations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { age, educationLevel, interests } = user;

    const query: any = { isPublished: true };

    // 🎯 Filter berdasarkan range umur
    if (age) {
      query["targetAgeRange.min"] = { $lte: age };
      query["targetAgeRange.max"] = { $gte: age };
    }

    // 🎯 Filter berdasarkan tingkat pendidikan
    if (educationLevel) {
      query["targetEducationLevel"] = educationLevel;
    }

    // 🎯 Filter berdasarkan minat
    if (interests && interests.length > 0) {
      query["targetInterests"] = { $in: interests };
    }

    const courses = await Course.find(query)
      .select("title slug category thumbnailUrl price teacher")
      .populate("teacher", "fullName username");

    if (courses.length === 0) {
      return res.json({
        message: "No matching recommendations found. Try updating your interests!",
        data: [],
      });
    }

    return res.json({
      message: "Recommended courses found",
      count: courses.length,
      data: courses,
    });
  } catch (err: any) {
    logger.error("getRecommendations error: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};
