// src/controllers/dashboard.controller.ts
import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/verifyToken";
import User from "../models/user.model";
import Course from "../models/course.model";
import Enrollment from "../models/enrollment.model";
import Certificate from "../models/certificate.model";
import { logger } from "../utils/logger";

/**
 * GET /api/v1/dashboard
 * Role-aware quick dashboard:
 * - admin: summary + small stats
 * - teacher: stats about their courses (total courses, enrollments)
 * - student: profile-card style (total courses, progress, certificates)
 */
export const getDashboard = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // base summary for everyone
    const totalUsersPromise = User.countDocuments();
    const totalCoursesPromise = Course.countDocuments({ isPublished: true });
    const totalEnrollmentsPromise = Enrollment.countDocuments();

    const [totalUsers, totalCourses, totalEnrollments] = await Promise.all([
      totalUsersPromise,
      totalCoursesPromise,
      totalEnrollmentsPromise,
    ]);

    // role specifics
    if (user.role === "admin") {
      // recent courses (latest 5)
      const recentCourses = await Course.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title teacher isPublished createdAt")
        .populate("teacher", "fullName username")
        .lean();

      const certCount = await Certificate.countDocuments();

      return res.json({
        role: "admin",
        stats: {
          totalUsers,
          totalCourses,
          totalEnrollments,
          totalCertificates: certCount,
        },
        recentCourses,
      });
    } else if (user.role === "teacher") {
      // teacher-specific: courses taught + enrollments for those courses
      const myCourses = await Course.find({ teacher: user.id }).select("_id title isPublished").lean();
      const courseIds = myCourses.map((c) => c._id);
      const myEnrollCount = await Enrollment.countDocuments({ course: { $in: courseIds } });

      return res.json({
        role: "teacher",
        stats: {
          totalUsers,
          myCoursesCount: myCourses.length,
          myEnrollments: myEnrollCount,
        },
        courses: myCourses,
      });
    } else {
      // student
      const myEnrollments = await Enrollment.find({ student: user.id })
        .populate("course", "title thumbnailUrl slug")
        .lean();

      // compute progress summary
      const totalCoursesTaken = myEnrollments.length;
      const avgProgress =
        myEnrollments.reduce((acc, e: any) => acc + (e.progress || 0), 0) / (totalCoursesTaken || 1);

      const certificates = await Certificate.find({ student: user.id }).select("certificateId courseName certificateLink createdAt").lean();

      return res.json({
        role: "student",
        stats: {
          totalUsers,
          totalCoursesTaken,
          avgProgress: Math.round(avgProgress),
          totalCertificates: certificates.length,
        },
        enrollments: myEnrollments,
        certificates,
      });
    }
  } catch (err: any) {
    logger.error("getDashboard error: " + (err.message || err));
    return res.status(500).json({ message: "Server error" });
  }
};
