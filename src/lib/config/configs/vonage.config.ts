import { registerAs } from '@nestjs/config';

export const vonage = registerAs('vonage', () => ({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  from: process.env.VONAGE_FROM_NUMBER,
}));
