import { config } from 'dotenv';
config();
const appEnv = {
  NODE_ENV : (process.env.NODE_ENV as 'production' | 'development') || 'development',
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD as string,
  JWT_SECRET_ACCESS: process.env.JWT_SECRET_ACCESS as string,
  JWT_SECRET_REFRESH: process.env.JWT_SECRET_REFRESH as string,
  PORT : process.env.PORT ,
  ACCESS_TTL: process.env.ACCESS_TTL ,
  REFRESH_TTL_SEC: process.env.REFRESH_TTL_SEC as string,


  // CLOUDINARY CREDENTIALS
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

export const env = appEnv;
