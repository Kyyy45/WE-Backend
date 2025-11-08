export const courseDocs = {
  "/courses": {
    get: {
      tags: ["Courses"],
      summary: "Get all public courses",
      description: "Fetch a paginated list of all published courses.",
      parameters: [
        { name: "page", in: "query", schema: { type: "integer", default: 1 } },
        { name: "limit", in: "query", schema: { type: "integer", default: 12 } },
      ],
      responses: {
        200: {
          description: "List of all courses",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    _id: { type: "string", example: "64b12fca3a..." },
                    title: { type: "string", example: "Belajar React Dasar" },
                    price: { type: "number", example: 50000 },
                    category: { type: "string", example: "Web Development" },
                    teacher: {
                      type: "object",
                      properties: {
                        _id: { type: "string" },
                        fullName: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    post: {
      tags: ["Courses"],
      summary: "Create new course (Admin only)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["title", "teacherId", "price"],
              properties: {
                title: { type: "string", example: "Belajar React Dasar" },
                teacherId: { type: "string", example: "65391b52b95fbbd12e12b9b1" },
                price: { type: "number", example: 50000 },
                category: { type: "string", example: "Web Development" },
                targetAgeRange: {
                  type: "object",
                  properties: {
                    min: { type: "number", example: 17 },
                    max: { type: "number", example: 25 },
                  },
                },
                targetEducationLevel: { type: "string", example: "SMA" },
                targetInterests: {
                  type: "array",
                  items: { type: "string" },
                  example: ["Programming", "UI/UX"],
                },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Course created successfully" },
        403: { description: "Forbidden - Admin only" },
      },
    },
  },

  "/courses/{id}": {
    get: {
      tags: ["Courses"],
      summary: "Get course details by ID or slug",
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          example: "belajar-react-dasar",
        },
      ],
      responses: {
        200: { description: "Course found" },
        404: { description: "Course not found" },
      },
    },
  },
};
