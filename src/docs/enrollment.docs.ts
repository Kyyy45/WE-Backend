/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Enroll siswa ke kursus dan update progress
 */

/**
 * @swagger
 * /api/v1/enrollments:
 *   post:
 *     summary: Enroll student ke course (Admin only)
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *               studentId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Enroll berhasil
 */

/**
 * @swagger
 * /api/v1/enrollments/me:
 *   get:
 *     summary: Lihat semua enrollment milik siswa login
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar enrollment user
 */
