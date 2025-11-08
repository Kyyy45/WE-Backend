export const transactionDocs = {
  "/transactions": {
    post: {
      tags: ["Transactions"],
      summary: "Create new course transaction (Student)",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                courseId: { type: "string", example: "65391b52b95fbbd12e12b9b1" },
                paymentMethod: { type: "string", example: "qris" },
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
        201: { description: "Transaction created successfully" },
        400: { description: "Invalid data" },
      },
    },
  },

  "/transactions/me": {
    get: {
      tags: ["Transactions"],
      summary: "Get all transactions for logged-in user",
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: "Transaction list retrieved successfully" },
      },
    },
  },

  "/transactions/callback": {
    post: {
      tags: ["Transactions"],
      summary: "Webhook callback from Midtrans",
      description:
        "Endpoint for Midtrans to notify payment status updates. This is called automatically by Midtrans server.",
      responses: {
        200: { description: "Callback received, status updated" },
        400: { description: "Invalid payload" },
      },
    },
  },
};
