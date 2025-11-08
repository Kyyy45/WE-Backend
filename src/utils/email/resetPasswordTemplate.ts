export const resetPasswordTemplate = (fullName: string, resetLink: string) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f9fafb; padding: 40px 0;">
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
      <tr>
        <td style="background-color: #facc15; text-align: center; padding: 24px 0;">
          <h1 style="color: #1f2937; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">
            Worldpedia Education
          </h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 36px 40px;">
          <h2 style="color: #111827; font-size: 20px; margin-bottom: 18px;">Hai, ${fullName}</h2>
          <p style="color: #374151; font-size: 15px; line-height: 1.6; margin-bottom: 28px;">
            Kami menerima permintaan untuk mengatur ulang password akun Anda.<br/>
            Klik tombol di bawah ini untuk melanjutkan proses reset password.
          </p>

          <div style="text-align: center; margin: 36px 0;">
            <a href="${resetLink}"
              style="background-color: #facc15; color: #1f2937; text-decoration: none; font-size: 16px; font-weight: 600;
                     padding: 12px 28px; border-radius: 6px; display: inline-block; box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
              Reset Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Jika Anda tidak merasa meminta reset password, abaikan email ini.<br/>
            Link ini hanya berlaku selama <strong>1 jam</strong>.
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 36px 0;" />

          <p style="color: #9ca3af; font-size: 12px; text-align: center;">
            © ${new Date().getFullYear()} Worldpedia Education<br/>
            Belajar Cerdas, Berkembang Bersama.
          </p>
        </td>
      </tr>
    </table>
  </div>
`;
