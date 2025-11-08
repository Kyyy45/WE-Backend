import swaggerJsdoc from "swagger-jsdoc";
import { authDocs } from "./auth.docs";
import { courseDocs } from "./course.docs";
import { courseThumbnailDocs } from "./courseThumbnail.docs";
import { dashboardDocs } from "./dashboard.docs";
import { dashboardAnalyticsDocs } from "./dashboardAnalytics.docs";
import { enrollmentDocs } from "./enrollment.docs";
import { profileDocs } from "./profile.docs";
import { recommendationDocs } from "./recommendation.docs";
import { transactionDocs } from "./transaction.docs";
import { certificateDocs } from "./certificate.docs";

const paths = {
  ...authDocs,
  ...courseDocs,
  ...courseThumbnailDocs,
  ...dashboardDocs,
  ...dashboardAnalyticsDocs,
  ...enrollmentDocs,
  ...profileDocs,
  ...recommendationDocs,
  ...transactionDocs,
  ...certificateDocs,
};

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "Worldpedia Education API",
    version: "1.0.0",
    description: `
## 📘 Worldpedia Education REST API

API ini digunakan oleh aplikasi **Worldpedia Education** untuk mengelola:
- 🔐 *Autentikasi & Otorisasi (JWT)*
- 🎓 *Kursus & Enrollments*
- 💳 *Pembayaran & Transaksi (Midtrans)*
- 📈 *Dashboard & Analitik*
- 🏅 *Sertifikat & Rekomendasi Kursus*

**Base URL:** \`https://your-domain.com/api/v1\`  
**Auth:** Bearer Token (JWT)  
**Format:** JSON
    `,
    contact: {
      name: "Worldpedia Team",
      url: "https://worldpedia-edu.com",
      email: "support@worldpedia-edu.com",
    },
  },
  servers: [
    { url: "http://localhost:5000/api/v1", description: "Local Server" },
    {
      url: "https://worldpedia-backend.vercel.app/api/v1",
      description: "Production Server",
    },
  ],
  tags: [
    { name: "Auth", description: "Autentikasi dan otorisasi pengguna" },
    { name: "Courses", description: "CRUD dan manajemen kursus" },
    {
      name: "Course Thumbnails",
      description: "Upload & hapus thumbnail kursus",
    },
    { name: "Dashboard", description: "Dashboard data pengguna dan admin" },
    { name: "Dashboard Analytics", description: "Analitik sistem untuk admin" },
    {
      name: "Enrollments",
      description: "Manajemen enrollment siswa ke kursus",
    },
    { name: "Profile", description: "Profil pengguna dan avatar" },
    { name: "Recommendations", description: "Rekomendasi kursus untuk siswa" },
    { name: "Transactions", description: "Transaksi pembayaran via Midtrans" },
    { name: "Certificates", description: "Manajemen sertifikat siswa" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [{ bearerAuth: [] }],
  paths,
};

const options = {
  swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
