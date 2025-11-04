import nodemailer from 'nodemailer';
import { getEnv } from './env';
import { logger } from './logger';

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

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html: `
        <div style="font-family:Arial,sans-serif;padding:16px;">
          <h3>Worldpedia Education</h3>
          <div style="background:#fff;padding:12px;border-radius:8px;">
            ${html}
          </div>
          <p style="font-size:12px;color:#666">If you didn't request this, please ignore.</p>
        </div>
      `,
    });
    logger.info(`Email sent to ${to} (${info.messageId})`);
  } catch (err) {
    logger.error('sendMail error: ' + (err as Error).message);
    throw err;
  }
};
