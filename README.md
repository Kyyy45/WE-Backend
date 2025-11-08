# 🌐 Worldpedia Education — Backend API Documentation

Sistem ini dibangun dengan **Node.js (Express + TypeScript)** menggunakan arsitektur **MERN Stack**.
Fitur utama meliputi autentikasi JWT, pendaftaran siswa, transaksi pembayaran (Midtrans), manajemen kursus, sertifikat digital, Asisten Berbasis Aturan (Rule-Based Assistant), filter berbasis atribut (Atribute-Based Filtering), dashboard analytics.

---

## 🚀 Cara Menjalankan Proyek

1.  **Clone repositori**
    ```bash
    git clone [https://github.com/Kyyy45/WE-Backend.git](https://github.com/Kyyy45/WE-Backend.git)
    cd WE-Backend
    ```

2.  **Install dependensi**
    ```bash
    npm install
    ```

3.  **Setup file `.env`**
    Buat file `.env` di root proyek dan isi variabel yang diperlukan (lihat daftar lengkap di bawah).

4.  **Jalankan server development**
    ```bash
    npm run dev
    ```

5.  **Akses API**
    * **Base URL:** `http://localhost:5000/api/v1`
    * **API Docs (Swagger):** `http://localhost:5000/api-docs`

---

## 🔑 Variabel Lingkungan (.env)

Pastikan Anda membuat file `.env` dengan variabel berikut:

```plaintext
# Server & Klien
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:3000

# Database
MONGO_URI=...

# JWT Secrets
JWT_SECRET=...
JWT_REFRESH_SECRET=...
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRE=7d

# Email (Nodemailer)
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM="Worldpedia" <no-reply@worldpedia.com>

# Cloudinary
CLOUDINARY_URL=...

# Midtrans
MIDTRANS_SERVER_KEY=...
MIDTRANS_BASE_URL=...

# Keamanan & Lainnya
RATE_LIMIT_POINTS=100
RATE_LIMIT_DURATION=60
DASHBOARD_CACHE_TTL=60
DASHBOARD_MONTHS=6

🔐 Authentication & Authorization
Role	Deskripsi
Admin	Mengelola pengguna, kursus, dashboard, transaksi.
Teacher	Mengajar kursus, menilai & memantau siswa.
Student	Mendaftar kursus, mengakses materi, melihat sertifikat.

Ekspor ke Spreadsheet

Gunakan header: Authorization: Bearer <access_token>

📦 API Endpoints
1. 🧍 Auth Routes — /auth
(Lihat src/docs/auth.docs.ts untuk detail)

2. 👥 User Management Routes — /users (Khusus Admin)
Method	Endpoint	Role	Deskripsi
GET	/	Admin	Lihat semua pengguna (dengan pagination)
PUT	/:id/role	Admin	Ubah role pengguna (student, teacher, admin)
DELETE	/:id	Admin	Nonaktifkan (soft delete) akun pengguna

Ekspor ke Spreadsheet

3. 🎓 Course Routes — /courses
(Lihat src/docs/course.docs.ts untuk detail)

4. 🖼 Course Thumbnail Routes — /course-thumbnails
(Lihat src/docs/courseThumbnail.docs.ts untuk detail)

5. 📊 Dashboard Routes — /dashboard
(Lihat src/docs/dashboard.docs.ts & dashboardAnalytics.docs.ts untuk detail)

6. 📜 Enrollment Routes — /enrollments
(Lihat src/docs/enrollment.docs.ts untuk detail)

7. 🧾 Certificate Routes — /certificates
(Lihat src/docs/certificate.docs.ts untuk detail)

8. 👤 Profile Routes — /profile
(Lihat src/docs/profile.docs.ts untuk detail)

10. 💳 Transaction Routes — /transactions
(Lihat src/docs/transaction.docs.ts untuk detail)

⚙️ Authentication Flow
Plaintext

REGISTER -> ACTIVATE EMAIL -> LOGIN -> RECEIVE JWT ->
ACCESS PROTECTED ROUTES -> REFRESH TOKEN -> LOGOUT
💬 Notes
Semua token menggunakan JWT Access & Refresh.

File diupload ke Cloudinary (thumbnail/avatar).

Pembayaran via Midtrans API (sandbox).

Dashboard admin realtime (menggunakan agregasi MongoDB).

Rekomendasi kursus berbasis content-based filtering.

🧠 Developer Info
Backend: Node.js, Express, TypeScript

Database: MongoDB + Mongoose

Keamanan: JWT, helmet, cors, express-rate-limit, express-validator, express-mongo-sanitize, hpp

Payment: Midtrans Sandbox API

Docs: Swagger UI → http://localhost:5000/api-docs

📘 Author: Rizky Akbar 🎓 Project: Worldpedia Education