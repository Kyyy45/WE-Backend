/**
 * @swagger
 * tags:
 *   name: Course Thumbnails
 *   description: Upload dan hapus thumbnail untuk kursus
 */

/**
 * @swagger
 * /api/v1/course-thumbnails/{id}/thumbnail:
 *   post:
 *     summary: Upload atau ganti thumbnail course (Admin only)
 *     tags: [Course Thumbnails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dari course
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Thumbnail berhasil diupload
 *       400:
 *         description: Gagal upload thumbnail
 */

/**
 * @swagger
 * /api/v1/course-thumbnails/{id}/thumbnail:
 *   delete:
 *     summary: Hapus thumbnail course (Admin only)
 *     tags: [Course Thumbnails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID dari course
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thumbnail berhasil dihapus
 */
