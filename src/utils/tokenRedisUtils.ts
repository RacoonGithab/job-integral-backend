import {getRedisClient} from "../config/conectionRedis";


const isJtiBlacklisted = async (jti: string): Promise<boolean> => {
    const client = getRedisClient();
    const result = await client.get(jti);
    return result === 'blacklisted';
};

export const tokenRedisUtil = {
    isJtiBlacklisted
}