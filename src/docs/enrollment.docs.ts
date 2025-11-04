/**
 * @swagger
 * tags:
 * name: Enrollments
 * description: Enroll siswa ke kursus dan update progress
 */

/**
 * @swagger
 * /api/v1/enrollments:
 * post:
 * summary: Enroll student ke course (Admin only)
 * tags: [Enrollments]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * courseId:
 * type: string
 * example: 65391b52b95fbbd12e12b9b1
 * studentId:
 * type: string
 * example: 65391b52b95fbbd12e12b9b2
 * customAnswers:
 * type: array
 * description: "Jawaban dari form kustom kursus"
 * items:
 * type: object
 * properties:
 * fieldName: { type: string, example: "asal_sekolah" }
 * value: { type: string, example: "SMA Negeri 1" }
 * responses:
 * 201:
 * description: Enroll berhasil
 */

/**
 * @swagger
 * /api/v1/enrollments/me:
 * get:
 * summary: Lihat semua enrollment milik siswa login
 * tags: [Enrollments]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Daftar enrollment user
 */