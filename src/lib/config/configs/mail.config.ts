import { registerAs } from '@nestjs/config';

export const mail = registerAs('mail', () => ({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  senderEmail: process.env.SMTP_SENDER_MAIL,
}));
