/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: CRUD data kursus
 */

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Ambil semua kursus (publik)
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Daftar semua kursus
 */

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Ambil detail kursus berdasarkan ID
 *     tags: [Courses]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Kursus ditemukan
 */

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Tambahkan kursus baru (Admin only)
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, slug, teacher, price]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Belajar React Dasar
 *               slug:
 *                 type: string
 *                 example: belajar-react-dasar
 *               price:
 *                 type: number
 *                 example: 50000
 *               teacher:
 *                 type: string
 *                 example: 65391b52b95fbbd12e12b9b1
 *     responses:
 *       201:
 *         description: Kursus berhasil dibuat
 */
