import nodemailer from 'nodemailer';
import { getEnv } from '../env';
import { logger } from '../logger';

const SMTP_HOST = getEnv('SMTP_HOST');
const SMTP_PORT = Number(getEnv('SMTP_PORT'));
const SMTP_USER = getEnv('SMTP_USER');
const SMTP_PASS = getEnv('SMTP_PASS');
const EMAIL_FROM = getEnv('EMAIL_FROM', 'no-reply@example.com');

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

const wrapTemplate = (content: string, subject: string) => `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #fefce8; padding: 40px 0;">
    <div style="max-width: 600px; background: #ffffff; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #facc15; padding: 20px 30px;">
        <h2 style="margin: 0; color: #111827; font-size: 22px; font-weight: 700;">Worldpedia Education</h2>
      </div>
      <div style="padding: 30px;">
        ${content}
      </div>
      <div style="padding: 15px 30px; font-size: 12px; color: #6b7280; text-align: center; border-top: 1px solid #f3f4f6;">
        <p style="margin: 4px 0;">Email ini dikirim secara otomatis oleh sistem Worldpedia Education.</p>
        <p style="margin: 0;">Jika Anda tidak merasa melakukan permintaan ini, abaikan saja email ini.</p>
      </div>
    </div>
  </div>
`;

export const sendMail = async (to: string, subject: string, htmlContent: string) => {
  try {
    const html = wrapTemplate(htmlContent, subject);

    const info = await transporter.sendMail({
      from: `"Worldpedia Education" <${EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    
    logger.info(`Email sent to ${to} (${info.messageId})`);
  } catch (err) {
    logger.error('sendMail error: ' + (err as Error).message);
    throw err;
  }
};
