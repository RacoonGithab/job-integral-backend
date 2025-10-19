import {connectRedis} from "../config/conectionRedis";
import {connectMongo} from "../config/connectMongo";
import {connectFirebase} from "../config/connectFirebase";


export const initializeAppServices = async () => {
    try {
        await connectMongo();

        await connectRedis()

        await connectFirebase();
    } catch (error) {
        console.error('❌ Error initializing app services:', error);
        throw error;
    }
}