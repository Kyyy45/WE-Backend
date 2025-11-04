import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/verifyToken";
import User from "../models/user.model";
import Course from "../models/course.model";
import Enrollment from "../models/enrollment.model";
import Certificate from "../models/certificate.model";
import Transaction from "../models/transaction.model";
import { logger } from "../utils/logger";
import { getCache, setCache } from "../utils/dashboardCache";

/**
 * GET /api/v1/dashboard/analytics
 * Admin-only aggregated analytics for dashboard charts.
 */
const CACHE_KEY = "dashboard:analytics";
const CACHE_TTL = Number(process.env.DASHBOARD_CACHE_TTL || "60"); // seconds

export const getDashboardAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || req.user.role !== "admin")
      return res.status(403).json({ message: "Forbidden" });

    // 🔹 Try cache
    const cached = getCache<any>(CACHE_KEY);
    if (cached) return res.json({ fromCache: true, ...cached });

    // =========================
    // 1️⃣ Basic Totals
    // =========================
    const [
      totalUsers,
      totalCourses,
      totalEnrollments,
      totalCertificates,
      totalTransactions
    ] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Certificate.countDocuments(),
      Transaction.countDocuments()
    ]);

    // =========================
    // 2️⃣ Role Distribution
    // =========================
    const roleDistribution = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
      { $project: { role: "$_id", count: 1, _id: 0 } }
    ]);

    // =========================
    // 3️⃣ Monthly Registrations & Enrollments
    // =========================
    const months = Number(process.env.DASHBOARD_MONTHS || "6");
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (months - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const monthlyRegistrations = await User.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          month: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }] },
          count: 1,
          _id: 0,
        },
      },
    ]);

    const monthlyEnrollments = await Enrollment.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          month: { $concat: [{ $toString: "$_id.year" }, "-", { $toString: "$_id.month" }] },
          count: 1,
          _id: 0,
        },
      },
    ]);

    // =========================
    // 4️⃣ Top Courses
    // =========================
    const topCourses = await Enrollment.aggregate([
      { $group: { _id: "$course", enrollCount: { $sum: 1 } } },
      { $sort: { enrollCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          courseId: "$course._id",
          title: "$course.title",
          enrollCount: 1,
        },
      },
    ]);

    // =========================
    // 5️⃣ Course Progress Overview
    // =========================
    const courseProgress = await Enrollment.aggregate([
      {
        $group: {
          _id: "$course",
          avgProgress: { $avg: "$progress" },
          count: { $sum: 1 },
        },
      },
      { $sort: { avgProgress: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          courseId: "$course._id",
          title: "$course.title",
          avgProgress: { $round: ["$avgProgress", 0] },
          enrollCount: "$count",
        },
      },
    ]);

    // =========================
    // 6️⃣ Transaction Analytics (Revenue)
    // =========================
    const totalRevenueAgg = await Transaction.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueAgg[0]?.totalRevenue || 0;

    const paymentStatus = await Transaction.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { status: "$_id", count: 1, _id: 0 } },
    ]);

    const paymentMethodStats = await Transaction.aggregate([
      { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
      { $project: { method: "$_id", count: 1, _id: 0 } },
    ]);

    const monthlyRevenue = await Transaction.aggregate([
      { $match: { status: "success", createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              { $toString: "$_id.month" },
            ],
          },
          revenue: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    // =========================
    // ✅ Final Combined Payload
    // =========================
    const payload = {
      totals: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalCertificates,
        totalTransactions,
        totalRevenue,
      },
      roleDistribution,
      monthlyRegistrations,
      monthlyEnrollments,
      topCourses,
      courseProgress,
      monthlyRevenue,
      paymentStatus,
      paymentMethodStats,
      generatedAt: new Date().toISOString(),
    };

    setCache(CACHE_KEY, payload, CACHE_TTL);
    return res.json({ fromCache: false, ...payload });
  } catch (err: any) {
    logger.error("getDashboardAnalytics error: " + err.message);
    return res.status(500).json({ message: "Server error" });
  }
};
