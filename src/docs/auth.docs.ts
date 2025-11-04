/**
 * @swagger
 * tags:
 * name: Authentication
 * description: Endpoint untuk registrasi, login, aktivasi, dan reset password
 */

/**
 * @swagger
 * /api/v1/auth/register:
 * post:
 * summary: Registrasi pengguna baru
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [fullName, username, email, password, confirmPassword]
 * properties:
 * fullName:
 * type: string
 * example: Rizky Akbar
 * username:
 * type: string
 * example: rizky123
 * email:
 * type: string
 * format: email
 * example: rizky@mail.com
 * password:
 * type: string
 * description: "Minimal 8 karakter, 1 huruf kapital, 1 angka, 1 simbol"
 * example: "PasswordKuat123!"
 * confirmPassword:
 * type: string
 * example: "PasswordKuat123!"
 * responses:
 * 201:
 * description: Registrasi berhasil dan email aktivasi dikirim
 * 400:
 * description: Input tidak valid
 */

/**
 * @swagger
 * /api/v1/auth/login:
 * post:
 * summary: Login user
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [emailOrUsername, password]
 * properties:
 * emailOrUsername:
 * type: string
 * example: rizky@mail.com
 * password:
 * type: string
 * example: "PasswordKuat123!"
 * responses:
 * 200:
 * description: Login sukses dan mengembalikan token JWT
 * 403:
 * description: Akun belum diaktivasi
 * 400:
 * description: Kredensial salah
 */

/**
 * @swagger
 * /api/v1/auth/resend-activation:
 * post:
 * summary: Kirim ulang email aktivasi
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email]
 * properties:
 * email:
 * type: string
 * format: email
 * example: rizky@mail.com
 * responses:
 * 200:
 * description: Email aktivasi berhasil dikirim ulang
 * 400:
 * description: Akun sudah diaktivasi atau email tidak valid
 * 404:
 * description: Pengguna tidak ditemukan
 */

/**
 * @swagger
 * /api/v1/auth/activate:
 * get:
 * summary: Aktivasi akun user
 * tags: [Authentication]
 * parameters:
 * - name: token
 * in: query
 * required: true
 * schema:
 * type: string
 * - name: email
 * in: query
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Akun berhasil diaktivasi
 * 400:
 * description: Token tidak valid atau kedaluwarsa
 */

/**
 * @swagger
 * /api/v1/auth/logout:
 * post:
 * summary: Logout user (hapus refresh token)
 * tags: [Authentication]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: Logout berhasil
 */

/**
 * @swagger
 * /api/v1/auth/forgot-password:
 * post:
 * summary: Kirim email reset password
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * format: email
 * example: rizky@mail.com
 * responses:
 * 200:
 * description: Email reset password dikirim
 */

/**
 * @swagger
 * /api/v1/auth/reset-password:
 * post:
 * summary: Reset password
 * tags: [Authentication]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email, token, newPassword, confirmNewPassword]
 * properties:
 * email:
 * type: string
 * format: email
 * example: rizky@mail.com
 * token:
 * type: string
 * example: "e0f12fd1d3d3c0bae4de97638281fe081abf43a9c8141317"
 * newPassword:
 * type: string
 * description: "Minimal 8 karakter, 1 huruf kapital, 1 angka, 1 simbol"
 * example: "PasswordBaru123!"
 * confirmNewPassword:
 * type: string
 * example: "PasswordBaru123!"
 * responses:
 * 200:
 * description: Password berhasil diperbarui
 * 400:
 * description: Token tidak valid atau password tidak cocok
 */