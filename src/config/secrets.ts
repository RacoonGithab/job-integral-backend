import dotenv from 'dotenv';

dotenv.config();

export const env = {
    APP_PORT: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : 3000,
    REDIS_HOST: process.env.REDIS_HOST || 'localhost',
    REDIS_PORT: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
}