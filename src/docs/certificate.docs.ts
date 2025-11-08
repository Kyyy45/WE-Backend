export const certificateDocs = {
  // 📘 Ambil semua sertifikat (Admin)
  "/certificates": {
    get: {
      tags: ["Certificates"],
      summary: "Get all certificates (Admin only)",
      description: "Returns a list of all issued certificates. Admin access required.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "List of all certificates",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string", example: "674b321ffbd2ab321ab4f7e9" },
                    certificateId: { type: "string", example: "WPE-WEB-0001" },
                    courseName: { type: "string", example: "Web Development for Beginners" },
                    student: {
                      type: "object",
                      properties: {
                        _id: { type: "string", example: "674b21ffbd2a1b3fda4b7e1a" },
                        fullName: { type: "string", example: "John Doe" },
                      },
                    },
                    certificateLink: {
                      type: "string",
                      example: "https://drive.google.com/drive/folders/abc123",
                    },
                    issuedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
        403: { description: "Forbidden - Admins only" },
      },
    },
  },

  // 📘 Ambil sertifikat milik user login
  "/certificates/me": {
    get: {
      tags: ["Certificates"],
      summary: "Get certificates of logged-in user",
      description: "Returns all certificates owned by the currently logged-in student.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "List of user's certificates",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    certificateId: { type: "string", example: "WPE-DESIGN-0023" },
                    courseName: { type: "string", example: "Graphic Design Fundamentals" },
                    certificateLink: {
                      type: "string",
                      example: "https://drive.google.com/drive/folders/design123",
                    },
                    issuedAt: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
        401: { description: "Unauthorized" },
      },
    },
  },

  // 📘 Ambil detail sertifikat by ID
  "/certificates/{id}": {
    get: {
      tags: ["Certificates"],
      summary: "Get certificate details by ID",
      description: "Returns the details of a specific certificate by its ID.",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Certificate ID (MongoDB ObjectId)",
        },
      ],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Certificate details",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  _id: { type: "string", example: "674b321ffbd2ab321ab4f7e9" },
                  certificateId: { type: "string", example: "WPE-WEB-0001" },
                  courseName: { type: "string", example: "Web Development for Beginners" },
                  student: {
                    type: "object",
                    properties: {
                      _id: { type: "string", example: "674b21ffbd2a1b3fda4b7e1a" },
                      fullName: { type: "string", example: "John Doe" },
                    },
                  },
                  certificateLink: {
                    type: "string",
                    example: "https://drive.google.com/drive/folders/abc123",
                  },
                  issuedAt: { type: "string", format: "date-time" },
                },
              },
            },
          },
        },
        404: { description: "Certificate not found" },
      },
    },
  },
};
