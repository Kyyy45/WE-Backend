export const dashboardAnalyticsDocs = {
  "/dashboard/analytics": {
    get: {
      tags: ["Dashboard Analytics"],
      summary: "Get admin dashboard analytics",
      description:
        "Retrieve aggregated statistics: total users, courses, enrollments, certificates, role distribution, monthly trends, and progress averages. Admin only.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Analytics data retrieved successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  fromCache: { type: "boolean", example: false },
                  totals: {
                    type: "object",
                    properties: {
                      totalUsers: { type: "integer", example: 150 },
                      totalCourses: { type: "integer", example: 12 },
                      totalEnrollments: { type: "integer", example: 340 },
                      totalCertificates: { type: "integer", example: 85 },
                    },
                  },
                  roleDistribution: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        role: { type: "string", example: "student" },
                        count: { type: "integer", example: 120 },
                      },
                    },
                  },
                  generatedAt: {
                    type: "string",
                    format: "date-time",
                    example: "2025-11-03T12:00:00Z",
                  },
                },
              },
            },
          },
        },
        403: { description: "Forbidden - Admin only" },
        500: { description: "Server error" },
      },
    },
  },
};
