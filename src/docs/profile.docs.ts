/**
 * @swagger
 * tags:
 * name: Profile
 * description: Manajemen profil pengguna
 */

/**
 * @swagger
 * /api/v1/profile:
 * get:
 * summary: Ambil profil pengguna login
 * tags: [Profile]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Profil ditemukan
 */

/**
 * @swagger
 * /api/v1/profile:
 * put:
 * summary: Update profil pengguna login (data teks)
 * tags: [Profile]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * fullName:
 * type: string
 * example: Rizky Akbar Terbaru
 * username:
 * type: string
 * example: rizky_akbar99
 * age:
 * type: number
 * example: 25
 * educationLevel:
 * type: string
 * example: "SMA"
 * interests:
 * type: array
 * items:
 * type: string
 * example: ["Sains", "Teknologi"]
 * responses:
 * 200:
 * description: Profil berhasil diperbarui
 */

/**
 * @swagger
 * /api/v1/profile/password:
 * put:
 * summary: Ganti password pengguna
 * tags: [Profile]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [oldPassword, newPassword]
 * properties:
 * oldPassword:
 * type: string
 * example: "PasswordLama123!"
 * newPassword:
 * type: string
 * description: "Minimal 8 karakter, 1 huruf kapital, 1 angka, 1 simbol"
 * example: "PasswordSuperBaru456!"
 * responses:
 * 200:
 * description: Password berhasil diganti
 */

/**
 * @swagger
 * /api/v1/profile/avatar:
 * put:
 * summary: Upload atau ganti avatar pengguna
 * tags: [Profile]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * avatar:
 * type: string
 * format: binary
 * responses:
 * 200:
 * description: Avatar berhasil diperbarui
 */