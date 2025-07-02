import {connectRedis} from "../config/conectionRedis";


export const initializeAppServices = async () => {
    try {
        await connectRedis()
    } catch (error) {
        console.error('❌ Error initializing app services:', error);
        throw error;
    }
}