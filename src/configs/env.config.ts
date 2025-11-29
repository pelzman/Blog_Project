import { config } from 'dotenv';
config();
const appEnv = {
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD as string,
  JWT_SECRET: process.env.JWT_SECRET as string,
  PORT : process.env.PORT ,
  JWT_EXPIRES: process.env.JWT_EXPIRES as string
};

export const env = appEnv;
