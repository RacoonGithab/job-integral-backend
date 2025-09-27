import {connectRedis} from "../config/conectionRedis";
import {connectMongo} from "../config/connectMongo";


export const initializeAppServices = async () => {
    try {
        await connectMongo();

        await connectRedis()
    } catch (error) {
        console.error('❌ Error initializing app services:', error);
        throw error;
    }
}