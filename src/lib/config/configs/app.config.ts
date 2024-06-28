import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => ({
  name: process.env.APP_NAME,
  url: process.env.APP_URL,
  port: Number(process.env.APP_PORT) || 1111,
  env: process.env.NODE_ENV || 'development',
}));
