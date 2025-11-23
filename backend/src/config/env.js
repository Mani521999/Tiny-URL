import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  APP_VERSION: process.env.APP_VERSION || '1.0'
};

if (!env.DATABASE_URL) {
  console.warn('Warning: DATABASE_URL is not set. Database operations will fail.');
}
