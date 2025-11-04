import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Worldpedia Education API",
      version: "1.0.0",
      description:
        "Dokumentasi API resmi untuk sistem **Worldpedia Education**, meliputi autentikasi, kursus, transaksi, dashboard analitik, rekomendasi, dan lainnya.",
      contact: {
        name: "Worldpedia Team",
        email: "support@worldpedia.com",
      },
    },
    servers: [
      {
        url: process.env.SERVER_URL || "http://localhost:5000",
        description: "Development server",
      },
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  // Lokasi file dokumentasi Swagger (semua doc.ts yang kamu punya)
  apis: ["./src/docs/**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
