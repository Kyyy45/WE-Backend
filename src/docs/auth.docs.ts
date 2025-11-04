/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Endpoint untuk registrasi, login, aktivasi, dan reset password
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, username, email, password, confirmPassword]
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Rizky Akbar
 *               username:
 *                 type: string
 *                 example: rizky123
 *               email:
 *                 type: string
 *                 example: rizky@mail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               confirmPassword:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       201:
 *         description: Registrasi berhasil dan email aktivasi dikirim
 *       400:
 *         description: Input tidak valid
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [emailOrUsername, password]
 *             properties:
 *               emailOrUsername:
 *                 type: string
 *                 example: rizky@mail.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login sukses dan mengembalikan token JWT
 *       403:
 *         description: Akun belum diaktivasi
 *       400:
 *         description: Kredensial salah
 */

/**
 * @swagger
 * /api/v1/auth/activate:
 *   get:
 *     summary: Aktivasi akun user
 *     tags: [Authentication]
 *     parameters:
 *       - name: token
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *       - name: email
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Akun berhasil diaktivasi
 *       400:
 *         description: Token tidak valid atau kedaluwarsa
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user (hapus refresh token)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 */

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 *   post:
 *     summary: Kirim email reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: rizky@mail.com
 *     responses:
 *       200:
 *         description: Email reset password dikirim
 */

/**
 * @swagger
 * /api/v1/auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password berhasil diperbarui
 */
