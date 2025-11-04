```markdown
# 🌐 Worldpedia Education — Backend API Documentation

Sistem ini dibangun dengan **Node.js (Express + TypeScript)** menggunakan arsitektur **MERN Stack**.
Fitur utama meliputi autentikasi JWT, manajemen kursus, pendaftaran siswa, sistem rekomendasi, transaksi pembayaran (Midtrans), dashboard analitik, dan sertifikat digital.

---

## 🚀 Base URL

**Development:**

```

http://localhost:5000/api/v1

```

---

## 🔐 Authentication & Authorization

| Role | Deskripsi |
| :--- | :--- |
| **Admin** | Mengelola pengguna, kursus, dashboard, transaksi. |
| **Teacher** | Mengajar kursus, menilai & memantau siswa. |
| **Student** | Mendaftar kursus, mengakses materi, melihat sertifikat. |

Gunakan header:

```

Authorization: Bearer \<access\_token\>

````

---

## 📦 API Endpoints

### 1. 🧍 Auth Routes — `/auth`

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `POST` | `/register` | Registrasi akun baru |
| `POST` | `/resend-activation` | Kirim ulang email aktivasi |
| `GET` | `/activate?token=...` | Aktivasi akun |
| `POST` | `/login` | Login dan dapatkan JWT |
| `POST` | `/refresh-token` | Perbarui access token |
| `POST` | `/logout` | Logout dan hapus token |
| `POST` | `/forgot-password` | Permintaan reset password |
| `POST` | `/reset-password` | Reset password dengan token |

---

### 2. 🎓 Course Routes — `/courses`

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All | Lihat semua kursus |
| `GET` | `/:id` | All | Detail kursus |
| `POST` | `/` | Admin | Tambah kursus baru |
| `PUT` | `/:id` | Admin | Update kursus |
| `DELETE` | `/:id` | Admin | Hapus kursus |

---

### 3. 🖼 Course Thumbnail Routes — `/course-thumbnails`

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/:id/thumbnail` | Admin | Upload thumbnail course |
| `DELETE` | `/:id/thumbnail` | Admin | Hapus thumbnail course |

---

### 4. 📊 Dashboard Routes — `/dashboard`

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Logged-in | Dashboard user (progress, statistik) |
| `GET` | `/analytics` | Admin | Dashboard analitik (tren, distribusi user, top course, transaksi) |

---

### 5. 📜 Enrollment Routes — `/enrollments`

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Admin | Tambahkan siswa ke kursus |
| `GET` | `/me` | Student | Lihat kursus yang diikuti |
| `PUT` | `/:id/progress` | Teacher | Update nilai/progress siswa |

---

### 6. 🧾 Certificate Routes — `/certificates`

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Admin | Lihat semua sertifikat |
| `GET` | `/me` | Student | Lihat sertifikat milik sendiri |
| `GET` | `/:id` | All | Lihat detail sertifikat tertentu |

---

### 7. 👤 Profile Routes — `/profile`

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | All Logged-in | Ambil data profil pengguna |
| `PUT` | `/` | All Logged-in | Update profil |
| `PUT` | `/password` | All Logged-in | Ganti password |
| `PUT` | `/avatar` | All Logged-in | Upload/ganti avatar (Cloudinary) |

---

### 8. 🤖 Recommendation Routes — `/recommendations`

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Student | Dapatkan rekomendasi kursus berdasarkan usia, pendidikan, dan minat |

---

### 9. 💳 Transaction Routes — `/transactions`

| Method | Endpoint | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Student | Buat transaksi pembayaran Midtrans |
| `GET` | `/me` | Student | Lihat riwayat transaksi pribadi |
| `POST` | `/callback` | Public (Webhook) | Callback status pembayaran dari Midtrans |

---

## 📈 Dashboard Analytics Data Example

```json
{
  "totals": {
    "totalUsers": 120,
    "totalCourses": 8,
    "totalEnrollments": 65,
    "totalCertificates": 20
  },
  "roleDistribution": [
    { "role": "student", "count": 90 },
    { "role": "teacher", "count": 10 },
    { "role": "admin", "count": 2 }
  ],
  "monthlyEnrollments": [
    { "month": "2025-07", "count": 12 },
    { "month": "2025-08", "count": 20 }
  ],
  "topCourses": [
    { "title": "Web Development", "enrollCount": 25 },
    { "title": "AI Basics", "enrollCount": 15 }
  ]
}
````

-----

## ⚙️ Authentication Flow

```text
REGISTER -> ACTIVATE EMAIL -> LOGIN -> RECEIVE JWT ->
ACCESS PROTECTED ROUTES -> REFRESH TOKEN -> LOGOUT
```

-----

## 💬 Notes

  * Semua token menggunakan **JWT Access & Refresh**.
  * File diupload ke **Cloudinary** (thumbnail/avatar).
  * Pembayaran via **Midtrans API (sandbox)**.
  * Dashboard admin realtime (menggunakan agregasi MongoDB).
  * Rekomendasi kursus berbasis **content-based filtering**.

-----

## 🧠 Developer Info

  * **Backend:** Node.js, Express, TypeScript
  * **Database:** MongoDB + Mongoose
  * **Security:** JWT, Helmet, Rate Limiter
  * **Payment:** Midtrans Sandbox API
  * **Docs:** Swagger UI → `http://localhost:5000/api-docs`

-----

📘 **Author:** Rizky Akbar
🎓 **Project:** Worldpedia Education (Chatbot + Recommendation + Analytics Dashboard)

```
```