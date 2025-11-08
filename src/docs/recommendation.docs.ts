export const recommendationDocs = {
  "/recommendations": {
    get: {
      tags: ["Recommendations"],
      summary: "Get recommended courses for student",
      description:
        "Generate personalized course recommendations based on user's age, education, and interests.",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Recommended courses fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string", example: "64b12fca3a..." },
                    title: { type: "string", example: "Belajar AI Dasar" },
                    category: { type: "string", example: "Data Science" },
                    matchScore: { type: "number", example: 92 },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
