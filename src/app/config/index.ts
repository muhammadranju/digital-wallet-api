import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  JWT: {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION as string,
  },
  ADMIN: {
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
  },
};
