export const profileDocs = {
  "/profile": {
    get: {
      tags: ["Profile"],
      summary: "Get logged-in user profile",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Profile found" },
        401: { description: "Unauthorized" },
      },
    },
    put: {
      tags: ["Profile"],
      summary: "Update logged-in user profile",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                fullName: { type: "string", example: "Rizky Akbar Terbaru" },
                username: { type: "string", example: "rizky_akbar99" },
                age: { type: "number", example: 25 },
                educationLevel: { type: "string", example: "SMA" },
                interests: {
                  type: "array",
                  items: { type: "string" },
                  example: ["Sains", "Teknologi"],
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Profile updated successfully" },
      },
    },
  },

  "/profile/password": {
    put: {
      tags: ["Profile"],
      summary: "Change user password",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["oldPassword", "newPassword"],
              properties: {
                oldPassword: { type: "string", example: "PasswordLama123!" },
                newPassword: {
                  type: "string",
                  example: "PasswordSuperBaru456!",
                  description:
                    "At least 8 characters, 1 uppercase, 1 number, 1 symbol",
                },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Password changed successfully" },
      },
    },
  },

  "/profile/avatar": {
    put: {
      tags: ["Profile"],
      summary: "Upload or update user avatar",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                avatar: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Avatar updated successfully" },
      },
    },
  },
};
