import { config } from 'dotenv';
config();
const appEnv = {
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  PORT : process.env.PORT ,
  JWT_EXPIRES: process.env.JWT_EXPIRES as string,


  // CLOUDINARY CREDENTIALS
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

export const env = appEnv;
