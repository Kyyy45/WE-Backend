export const courseThumbnailDocs = {
  "/course-thumbnails/{id}/thumbnail": {
    post: {
      tags: ["Course Thumbnails"],
      summary: "Upload or replace course thumbnail (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Course ID",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                file: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Thumbnail uploaded successfully" },
        400: { description: "Thumbnail upload failed" },
      },
    },
    delete: {
      tags: ["Course Thumbnails"],
      summary: "Delete course thumbnail (Admin only)",
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "string" },
          description: "Course ID",
        },
      ],
      responses: {
        200: { description: "Thumbnail deleted successfully" },
      },
    },
  },
};
