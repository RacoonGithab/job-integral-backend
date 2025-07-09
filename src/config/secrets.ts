import dotenv from 'dotenv';

dotenv.config();

export const env = {
    APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET as string,
    ACCESS_TOKEN_EXPIRES_IN: parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN || '2700', 10),
    REFRESH_TOKEN_EXPIRES_IN: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN || '3600', 10),
    RESET_PASSWORD_TOKEN_EXPIRES_IN: parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN || '600', 10),
    VERIFICATION_CODE_TTL: process.env.VERIFICATION_CODE_TTL!,
    MAX_CODE_ATTEMPTS: parseInt(process.env.MAX_CODE_ATTEMPTS!),
    SMTP_EMAIL_HOST: process.env.SMTP_EMAIL_HOST as string | undefined,
    SMTP_EMAIL_PORT: process.env.SMTP_EMAIL_PORT ? parseInt(process.env.SMTP_EMAIL_PORT, 10) : undefined,
    EMAIL_HOST_USER: process.env.EMAIL_HOST_USER as string | undefined,
    EMAIL_HOST_PASSWORD: process.env.EMAIL_HOST_PASSWORD as string | undefined,
    RESET_PASSWORD_MAX_REQUESTS: parseInt(process.env.RESET_PASSWORD_MAX_REQUESTS!),
    RESET_PASSWORD_WINDOW_SECONDS: parseInt(process.env.RESET_PASSWORD_WINDOW_SECONDS || '86400', 10),
}