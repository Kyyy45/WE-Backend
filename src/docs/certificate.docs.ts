/**
 * @swagger
 * tags:
 *   name: Certificates
 *   description: Manajemen sertifikat siswa
 */

/**
 * @swagger
 * /api/v1/certificates:
 *   get:
 *     summary: Ambil semua sertifikat (Admin only)
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar semua sertifikat
 */

/**
 * @swagger
 * /api/v1/certificates/me:
 *   get:
 *     summary: Ambil sertifikat milik user login
 *     tags: [Certificates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar sertifikat milik user
 */

/**
 * @swagger
 * /api/v1/certificates/{id}:
 *   get:
 *     summary: Ambil detail sertifikat berdasarkan ID
 *     tags: [Certificates]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detail sertifikat ditemukan
 */
