/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Statistik dan data dashboard pengguna
 */

/**
 * @swagger
 * /api/v1/dashboard:
 *   get:
 *     summary: Ambil data dashboard user login
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data dashboard berhasil diambil
 */

/**
 * @swagger
 * /api/v1/dashboard/analytics:
 *   get:
 *     summary: Ambil data analitik dashboard (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data analitik dashboard berhasil diambil
 */
