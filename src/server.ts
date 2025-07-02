import {Express} from "express";
import {createApp} from "./app";
import {env} from "./config/secrets";
import {initializeAppServices} from "./utils/init";

const startServer = (app:Express, port: number):void => {
    app.listen(port, (err?:Error):void => {
        if (err) {
            console.error(`Start server error: ${err.message}`);
        } else {
            console.info(`Server running on port: ${port}`);
        }
    })
}

async function startApplication(){
    try {
        await initializeAppServices();
        const app = createApp();
        startServer(app, env.APP_PORT);
    } catch (error) {
        console.error('❌ Error during application startup:', error);
    }
}

startApplication();