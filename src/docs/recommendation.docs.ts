/**
 * @swagger
 * tags:
 *   name: Recommendations
 *   description: Rekomendasi kursus berdasarkan usia, pendidikan, dan minat
 */

/**
 * @swagger
 * /api/v1/recommendations:
 *   get:
 *     summary: Dapatkan rekomendasi kursus untuk siswa
 *     tags: [Recommendations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar kursus rekomendasi berhasil diambil
 */
