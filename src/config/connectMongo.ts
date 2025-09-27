import mongoose from "mongoose";
import { env } from "./secrets"

export const connectMongo = async () => {
    try {
        await mongoose.connect(env.MONGO_URL);
        console.log("✅ Подключено к MongoDB");
    } catch (err) {
        console.error("❌ Ошибка подключения к MongoDB:", err);
        process.exit(1);
    }
}