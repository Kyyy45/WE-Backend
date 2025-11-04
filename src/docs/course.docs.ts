/**
 * @swagger
 * tags:
 * name: Courses
 * description: CRUD data kursus
 */

/**
 * @swagger
 * /api/v1/courses:
 * get:
 * summary: Ambil semua kursus (publik)
 * tags: [Courses]
 * parameters:
 * - name: page
 * in: query
 * schema: { type: integer, default: 1 }
 * - name: limit
 * in: query
 * schema: { type: integer, default: 12 }
 * responses:
 * 200:
 * description: Daftar semua kursus
 */

/**
 * @swagger
 * /api/v1/courses/{id}:
 * get:
 * summary: Ambil detail kursus berdasarkan ID atau Slug
 * tags: [Courses]
 * parameters:
 * - name: id
 * in: path
 * required: true
 * example: belajar-react-dasar
 * responses:
 * 200:
 * description: Kursus ditemukan
 */

/**
 * @swagger
 * /api/v1/courses:
 * post:
 * summary: Tambahkan kursus baru (Admin only)
 * tags: [Courses]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [title, teacherId, price]
 * properties:
 * title:
 * type: string
 * example: Belajar React Dasar
 * teacherId:
 * type: string
 * description: "ID dari User dengan role 'teacher'"
 * example: 65391b52b95fbbd12e12b9b1
 * price:
 * type: number
 * example: 50000
 * category:
 * type: string
 * example: "Web Development"
 * targetAgeRange:
 * type: object
 * properties:
 * min: { type: number, example: 17 }
 * max: { type: number, example: 25 }
 * targetEducationLevel:
 * type: string
 * example: "SMA"
 * targetInterests:
 * type: array
 * items:
 * type: string
 * example: ["Programming", "UI/UX"]
 * responses:
 * 201:
 * description: Kursus berhasil dibuat
 */