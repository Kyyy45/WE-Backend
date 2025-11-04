/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Pembayaran kursus via Midtrans
 */

/**
 * @swagger
 * /api/v1/transactions:
 *   post:
 *     summary: Buat transaksi baru (student)
 *     tags: [Transactions]
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
 *               paymentMethod:
 *                 type: string
 *                 example: qris
 *     responses:
 *       201:
 *         description: Transaksi berhasil dibuat
 */

/**
 * @swagger
 * /api/v1/transactions/me:
 *   get:
 *     summary: Ambil semua transaksi user login
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar transaksi ditemukan
 */

/**
 * @swagger
 * /api/v1/transactions/callback:
 *   post:
 *     summary: Webhook callback dari Midtrans
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: Callback diterima dan status diperbarui
 */
