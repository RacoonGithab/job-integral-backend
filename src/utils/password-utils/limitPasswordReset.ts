import {getRedisClient} from "../../config/conectionRedis";
import {env} from "../../config/secrets";

export const checkForgotPasswordRateLimitExceeded = async (identifier: string): Promise<boolean> => {
    const redisClient = getRedisClient();
    const key = `reset_password:${identifier}:${new Date().toISOString().split('T')[0]}`;
    const currentRequests = await redisClient.get(key);
    const requestCount = currentRequests ? parseInt(currentRequests, 10) : 0;
    return requestCount >= env.RESET_PASSWORD_MAX_REQUESTS;
};

export const incrementForgotPasswordRequestCount = async (identifier: string): Promise<void> => {
    const redisClient = getRedisClient();
    const key = `reset_password:${identifier}:${new Date().toISOString().split('T')[0]}`;
    await redisClient.incr(key);
    await redisClient.expire(key, env.RESET_PASSWORD_WINDOW_SECONDS);
};