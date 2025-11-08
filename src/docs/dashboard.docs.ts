export const dashboardDocs = {
  "/dashboard": {
    get: {
      tags: ["Dashboard"],
      summary: "Get dashboard data for logged-in user",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Dashboard data retrieved successfully" },
        401: { description: "Unauthorized" },
      },
    },
  },

  "/dashboard/analytics": {
    get: {
      tags: ["Dashboard"],
      summary: "Get dashboard analytics (Admin only)",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Analytics data retrieved successfully" },
        403: { description: "Forbidden - Admin only" },
      },
    },
  },
};
