export const enrollmentDocs = {
  "/enrollments": {
    post: {
      tags: ["Enrollments"],
      summary: "Enroll student to a course (Admin only)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                courseId: { type: "string", example: "65391b52b95fbbd12e12b9b1" },
                studentId: { type: "string", example: "65391b52b95fbbd12e12b9b2" },
                customAnswers: {
                  type: "array",
                  description: "Answers from custom course form",
                  items: {
                    type: "object",
                    properties: {
                      fieldName: { type: "string", example: "asal_sekolah" },
                      value: { type: "string", example: "SMA Negeri 1" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Enrollment created successfully" },
        400: { description: "Bad request" },
        403: { description: "Forbidden - Admin only" },
      },
    },
  },
  "/enrollments/me": {
    get: {
      tags: ["Enrollments"],
      summary: "Get all enrollments for logged-in student",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Enrollment list retrieved" },
        401: { description: "Unauthorized" },
      },
    },
  },
};
