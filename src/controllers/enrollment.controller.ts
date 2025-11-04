import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/verifyToken";
import Enrollment from "../models/enrollment.model";
import Course, { ICourse } from "../models/course.model";
import Certificate from "../models/certificate.model";
import User from "../models/user.model";
import { logger } from "../utils/logger";

/* --------------------- ADMIN: Tambah Student ke Course --------------------- */
export const enrollStudent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId, studentId, customAnswers } = req.body;

    if (!courseId || !studentId)
      return res.status(400).json({ message: "courseId and studentId required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const student = await User.findById(studentId);
    if (!student || student.role !== "student")
      return res.status(400).json({ message: "Invalid student" });

    // 🚫 Cegah duplikasi enrollment
    const exists = await Enrollment.findOne({ course: courseId, student: studentId });
    if (exists) return res.status(400).json({ message: "Already enrolled" });

    const enrollment = await Enrollment.create({
      course: courseId,
      student: studentId,
      progress: 0,
      grade: "",
      customAnswers: customAnswers || [],
    });

    // Simpan juga ke array `students` di course
    await Course.findByIdAndUpdate(courseId, { $addToSet: { students: studentId } });

    return res.status(201).json({
      message: "Student enrolled successfully",
      enrollment,
    });
  } catch (err: any) {
    logger.error("enrollStudent error: " + err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* --------------------- STUDENT: Lihat Enrollments Sendiri -------------------- */
export const getMyEnrollments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        populate: { path: "teacher", select: "fullName username email" },
      })
      .populate("student", "fullName username email");

    return res.json({ enrollments });
  } catch (err: any) {
    logger.error("getMyEnrollments error: " + err.message);
    return res.status(500).json({ message: "Server error" });
  }
};

/* --------------------- TEACHER: Update Nilai / Progress --------------------- */
export const updateProgress = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { progress, grade, note } = req.body;

    const enrollment = await Enrollment.findById(id)
      .populate({
        path: "course",
        populate: { path: "teacher", select: "_id fullName username email" },
      })
      .populate("student", "fullName username email");

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // ✅ Type guard memastikan course sudah ter-populate
    const rawCourse = enrollment.course;
    const courseDoc: ICourse | null =
      rawCourse && typeof rawCourse === "object" && "title" in rawCourse
        ? (rawCourse as unknown as ICourse)
        : null;

    if (!courseDoc || !courseDoc.teacher || courseDoc.teacher._id.toString() !== req.user?.id) {
      return res.status(403).json({ message: "Forbidden: not your course" });
    }

    // 🚫 Tidak boleh menurunkan progress yang sudah 100%
    if (typeof progress === "number" && enrollment.progress === 100 && progress < 100) {
      return res.status(400).json({ message: "Progress cannot be reduced after completion" });
    }

    // 🔹 Update progress, grade, dan catatan
    if (typeof progress === "number") enrollment.progress = progress;
    if (grade) enrollment.grade = grade;
    if (note) enrollment.note = note;

    await enrollment.save();

    // 🎓 Generate sertifikat otomatis saat progress = 100
    if (progress === 100) {
      try {
        const existing = await Certificate.findOne({
          student: enrollment.student,
          course: courseDoc._id,
        });

        if (!existing) {
          const prefix = "WPE";
          const courseCode = courseDoc.title.split(" ")[0].toUpperCase().substring(0, 3);
          const count = await Certificate.countDocuments();
          const certId = `${prefix}-${courseCode}-${(count + 1).toString().padStart(4, "0")}`;

          const certificateLink =
            courseDoc.certificateFolderLink ??
            "https://drive.google.com/drive/folders/default";

          await Certificate.create({
            certificateId: certId,
            student: enrollment.student,
            course: courseDoc._id,
            courseName: courseDoc.title,
            certificateLink,
          });

          logger.info(`🎓 Certificate generated for ${courseDoc.title} (${certId})`);
        } else {
          logger.info(
            `✅ Certificate already exists for ${courseDoc.title} (${existing.certificateId})`
          );
        }
      } catch (err: any) {
        logger.error("auto-certificate generation failed: " + err.message);
      }
    }

    return res.json({
      message: "Progress updated successfully",
      enrollment,
    });
  } catch (err: any) {
    logger.error("updateProgress error: " + err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
