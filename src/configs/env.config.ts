import { config } from 'dotenv';
config();
const appEnv = {
  LOGIN_PASSWORD: process.env.LOGIN_PASSWORD as string,
};

export const env = appEnv;
