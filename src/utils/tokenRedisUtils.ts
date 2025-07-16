import {getRedisClient} from "../config/conectionRedis";
import {JTI_BLACKLIST_PREFIX} from "./constants/redisConstants";


const addJtiToBlacklist = async (jti: string, expirationTimeSec: number): Promise<void> => {
    const client = getRedisClient();
    await client.setex(`${JTI_BLACKLIST_PREFIX}${jti}`, expirationTimeSec, 'blacklisted');
};

const isJtiBlacklisted = async (jti: string): Promise<boolean> => {
    const client = getRedisClient();
    const result = await client.get(`${JTI_BLACKLIST_PREFIX}${jti}`);
    return result === 'blacklisted';
};

// const blackListToken = async (token: string): Promise<void> => {
//     const decodedToken = tokenUtils.decodeToken(token);
//     if (decodedToken && 'jti' in decodedToken && 'exp' in decodedToken && typeof decodedToken.exp === 'number') {
//         const expirationTimeSec = decodedToken.exp - Math.floor(Date.now() / 1000);
//         await addJtiToBlacklist(decodedToken.jti, expirationTimeSec);
//     }
// }

export const tokenRedisUtil = {
    isJtiBlacklisted,
    addJtiToBlacklist
}