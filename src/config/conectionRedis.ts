import Redis from 'ioredis';
import {env} from "./secrets";

let redisClient: Redis | null = null;

const connectRedis = async (): Promise<Redis> => {
    if (!redisClient) {
        try {
            redisClient = new Redis({
                host: env.REDIS_HOST,
                port: env.REDIS_PORT,
            });

            redisClient.on('connect', () => {
                console.log('✅ Подключено к Redis!');
            });

            redisClient.on('error', (err) => {
                console.error('❌ Ошибка Redis:', err);
            });
        } catch (error) {
            console.error('❌ Ошибка при создании клиента Redis:', error);
            throw error;
        }
    }
    return redisClient;
};

const getRedisClient = (): Redis => {
    if (!redisClient) {
        throw new Error('Redis клиент не инициализирован. Сначала вызовите connectRedis().');
    }
    return redisClient;
};

export { connectRedis, getRedisClient };