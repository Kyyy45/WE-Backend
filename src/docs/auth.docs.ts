export const authDocs = {
  // 📘 Register
  "/auth/register": {
    post: {
      tags: ["Auth"],
      summary: "Register a new user",
      description: "Registers a new user and sends activation email.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["fullName", "username", "email", "password", "confirmPassword"],
              properties: {
                fullName: { type: "string", example: "John Doe" },
                username: { type: "string", example: "johndoe" },
                email: { type: "string", example: "john@example.com" },
                password: { type: "string", example: "Password@123" },
                confirmPassword: { type: "string", example: "Password@123" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Registered successfully. Activation email sent." },
        400: { description: "Validation error or email already exists" },
      },
    },
  },

  // 📘 Resend Activation Email
  "/auth/resend-activation": {
    post: {
      tags: ["Auth"],
      summary: "Resend activation email",
      description: "Resends activation email if user is not yet activated.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", example: "john@example.com" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Activation email resent successfully." },
        404: { description: "User not found" },
        400: { description: "Account already activated" },
      },
    },
  },

  // 📘 Activate Account
  "/auth/activate": {
    get: {
      tags: ["Auth"],
      summary: "Activate user account",
      description: "Activates user account using email and token sent by email.",
      parameters: [
        { name: "token", in: "query", required: true, schema: { type: "string" } },
        { name: "email", in: "query", required: true, schema: { type: "string" } },
      ],
      responses: {
        200: { description: "Account activated successfully" },
        400: { description: "Invalid or expired activation token" },
      },
    },
  },

  // 📘 Login
  "/auth/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      description: "Logs in a user and returns access token and refresh token cookie.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["emailOrUsername", "password"],
              properties: {
                emailOrUsername: { type: "string", example: "johndoe" },
                password: { type: "string", example: "Password@123" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Login successful" },
        400: { description: "Invalid credentials" },
        403: { description: "Account not activated" },
      },
    },
  },

  // 📘 Refresh Token
  "/auth/refresh-token": {
    post: {
      tags: ["Auth"],
      summary: "Refresh access token",
      description:
        "Uses refresh token cookie to generate a new access token. Requires valid refresh token.",
      responses: {
        200: { description: "Access token refreshed successfully" },
        401: { description: "Invalid or expired refresh token" },
      },
    },
  },

  // 📘 Logout
  "/auth/logout": {
    post: {
      tags: ["Auth"],
      summary: "Logout user",
      description: "Clears refresh token cookie and invalidates session.",
      responses: {
        200: { description: "Logged out successfully" },
      },
    },
  },

  // 📘 Forgot Password
  "/auth/forgot-password": {
    post: {
      tags: ["Auth"],
      summary: "Send password reset link",
      description: "Sends password reset email with token link.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email"],
              properties: {
                email: { type: "string", example: "john@example.com" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Password reset link sent" },
        404: { description: "User not found" },
      },
    },
  },

  // 📘 Reset Password
  "/auth/reset-password": {
    post: {
      tags: ["Auth"],
      summary: "Reset password",
      description: "Resets password using token sent to email.",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "token", "newPassword", "confirmNewPassword"],
              properties: {
                email: { type: "string", example: "john@example.com" },
                token: { type: "string", example: "b7c8f9..." },
                newPassword: { type: "string", example: "NewPassword@123" },
                confirmNewPassword: { type: "string", example: "NewPassword@123" },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Password updated successfully" },
        400: { description: "Invalid or expired token" },
      },
    },
  },
};
