import { Response } from "express";
import slugify from "slugify";
import Course from "../models/course.model";
import User from "../models/user.model";
import { logger } from "../utils/logger";
import { AuthenticatedRequest } from "../middlewares/verifyToken";

/**
 * Course controller:
 * - createCourse (admin)
 * - updateCourse (admin)
 * - deleteCourse (admin)
 * - listCourses (role-aware: admin/teacher/student/guest)
 * - getCourseById (role-aware)
 */

/* -------------------- Create course (Admin) -------------------- */
export const createCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      shortDescription,
      description,
      thumbnailUrl,
      teacherId,
      price = 0,
      currency = "IDR",
      category,
      targetAgeRange,
      targetEducationLevel,
      targetInterests,
      formFields = [],
      syllabus = [],
      isPublished = false,
      totalLessons = 0,
    } = req.body;

    if (!title || !teacherId) {
      return res.status(400).json({ message: "title and teacherId are required" });
    }

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "teacher") {
      return res.status(400).json({ message: "teacherId must be a valid teacher" });
    }

    // generate unique slug
    const base = slugify(title, { lower: true, strict: true });
    let slug = base;
    let suffix = 1;
    while (await Course.findOne({ slug })) slug = `${base}-${suffix++}`;

    const course = await Course.create({
      title,
      slug,
      shortDescription,
      description,
      thumbnailUrl,
      teacher: teacherId,
      price,
      currency,
      category,
      targetAgeRange,
      targetEducationLevel,
      targetInterests,
      formFields,
      syllabus,
      isPublished,
      totalLessons,
    });

    return res.status(201).json({ message: "Course created", course });
  } catch (err: any) {
    logger.error("createCourse error: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- Update course (Admin) -------------------- */
export const updateCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = {
      ...req.body,
      targetAgeRange: req.body.targetAgeRange,
      targetEducationLevel: req.body.targetEducationLevel,
      targetInterests: req.body.targetInterests,
      formFields: req.body.formFields,
    };

    // if title changes, re-generate slug
    if (updates.title) {
      const base = slugify(updates.title, { lower: true, strict: true });
      let slug = base;
      let suffix = 1;
      while (await Course.findOne({ slug, _id: { $ne: id } })) slug = `${base}-${suffix++}`;
      updates.slug = slug;
    }

    const course = await Course.findByIdAndUpdate(id, updates, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course updated", course });
  } catch (err: any) {
    logger.error("updateCourse error: " + err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- Delete course (Admin) -------------------- */
export const deleteCourse = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    return res.json({ message: "Course deleted" });
  } catch (err: any) {
    logger.error("deleteCourse error: " + (err.message || err));
    return res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- List courses (role-aware with filters) -------------------- */
export const listCourses = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    // queries: q, category, teacherId, minPrice, maxPrice, isPublished, page, limit, sort
    const {
      q,
      category,
      teacherId,
      minPrice,
      maxPrice,
      isPublished,
      page = "1",
      limit = "12",
      sortBy = "createdAt",
      order = "desc",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, parseInt(limit, 10) || 12);

    const filter: any = {};

    if (q) filter.$text = { $search: q };
    if (category) filter.category = category;
    if (teacherId) filter.teacher = teacherId;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

    // role-based visibility:
    if (!user) {
      // guest only published
      filter.isPublished = true;
    } else if (user.role === "student") {
      // student: show published + those he is enrolled in (students array)
      // we will show published courses plus courses where students includes user.id
      // implement as $or
      filter.$or = [{ isPublished: true }, { students: user.id }];
    } else if (user.role === "teacher") {
      // teacher: only courses they teach (or published all - depending policy)
      filter.teacher = user.id;
    } else if (user.role === "admin") {
      // admin sees all (no extra filter)
    }

    // If explicit isPublished filter provided by query, override
    if (typeof isPublished !== "undefined") {
      filter.isPublished = isPublished === "true";
    }

    const sortObj: any = { [sortBy]: order === "asc" ? 1 : -1 };

    const total = await Course.countDocuments(filter);
    const courses = await Course.find(filter)
      .sort(sortObj)
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate("teacher", "fullName username email")
      .lean();

    return res.json({
      meta: { total, page: pageNum, limit: pageSize, pages: Math.ceil(total / pageSize) },
      data: courses,
    });
  } catch (err: any) {
    logger.error("listCourses error: " + (err.message || err));
    return res.status(500).json({ message: "Server error" });
  }
};

/* -------------------- Get course by id or slug (role-aware) -------------------- */
export const getCourseById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const idOrSlug = req.params.id;
    const user = req.user;

    let course = null;
    // try objectId
    if (/^[0-9a-fA-F]{24}$/.test(idOrSlug)) {
      course = await Course.findById(idOrSlug).populate("teacher", "fullName username email").populate("students", "fullName username email");
    }
    if (!course) {
      course = await Course.findOne({ slug: idOrSlug }).populate("teacher", "fullName username email").populate("students", "fullName username email");
    }

    if (!course) return res.status(404).json({ message: "Course not found" });

    // guest cannot access unpublished
    if (!user && !course.isPublished) {
      return res.status(403).json({ message: "Access denied: course not published" });
    }

    // student who is not enrolled cannot access unpublished course
    if (user && user.role === "student" && !course.isPublished) {
      const isEnrolled = (course.students || []).some((s: any) => String(s) === String(user.id));
      if (!isEnrolled) return res.status(403).json({ message: "Access denied: course not published" });
    }

    // convenience flag: isEnrolled
    let isEnrolled = false;
    if (user && user.role === "student") {
      isEnrolled = (course.students || []).some((s: any) => String(s) === String(user.id));
    }

    const out = {
      ...course.toObject(),
      meta: { isEnrolled },
    };

    return res.json(out);
  } catch (err: any) {
    logger.error("getCourseById error: " + (err.message || err));
    return res.status(500).json({ message: "Server error" });
  }
};
