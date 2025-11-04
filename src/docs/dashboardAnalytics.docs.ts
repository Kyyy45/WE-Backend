/**
 * @swagger
 * tags:
 *   name: Dashboard Analytics
 *   description: Statistik dan analitik sistem (khusus admin)
 */

/**
 * @swagger
 * /api/v1/dashboard/analytics:
 *   get:
 *     summary: Ambil data analitik untuk dashboard admin
 *     description: >
 *       Mengambil berbagai data agregasi seperti total user, kursus, enrollment,
 *       sertifikat, serta distribusi peran, statistik bulanan, dan progress kursus.
 *       Endpoint ini hanya dapat diakses oleh **admin**.
 *     tags: [Dashboard Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data analitik berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fromCache:
 *                   type: boolean
 *                   example: false
 *                 totals:
 *                   type: object
 *                   properties:
 *                     totalUsers:
 *                       type: integer
 *                       example: 150
 *                     totalCourses:
 *                       type: integer
 *                       example: 12
 *                     totalEnrollments:
 *                       type: integer
 *                       example: 340
 *                     totalCertificates:
 *                       type: integer
 *                       example: 85
 *                 roleDistribution:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       role:
 *                         type: string
 *                         example: student
 *                       count:
 *                         type: integer
 *                         example: 120
 *                 monthlyRegistrations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2025-10"
 *                       count:
 *                         type: integer
 *                         example: 25
 *                 monthlyEnrollments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2025-09"
 *                       count:
 *                         type: integer
 *                         example: 30
 *                 topCourses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                         example: 64d14e2bfa9c12e9a5e9d421
 *                       title:
 *                         type: string
 *                         example: "Belajar AI Dasar"
 *                       enrollCount:
 *                         type: integer
 *                         example: 85
 *                 courseProgress:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: string
 *                         example: 64d14e2bfa9c12e9a5e9d421
 *                       title:
 *                         type: string
 *                         example: "Kursus Web Dasar"
 *                       avgProgress:
 *                         type: integer
 *                         example: 72
 *                       enrollCount:
 *                         type: integer
 *                         example: 30
 *                 paymentStatus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         example: success
 *                       count:
 *                         type: integer
 *                         example: 15
 *                 generatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-11-03T12:00:00Z"
 *       403:
 *         description: Hanya admin yang bisa mengakses endpoint ini
 *       500:
 *         description: Server error
 */
