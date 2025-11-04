/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Manajemen profil pengguna
 */

/**
 * @swagger
 * /api/v1/profile:
 *   get:
 *     summary: Ambil profil pengguna login
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil ditemukan
 */

/**
 * @swagger
 * /api/v1/profile:
 *   put:
 *     summary: Update profil pengguna login
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               fullName:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 */

/**
 * @swagger
 * /api/v1/profile/password:
 *   put:
 *     summary: Ganti password pengguna
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password berhasil diganti
 */

/**
 * @swagger
 * /api/v1/profile/avatar:
 *   put:
 *     summary: Upload atau ganti avatar pengguna
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar berhasil diperbarui
 */
