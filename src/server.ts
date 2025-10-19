import {Express} from "express";
import {createApp} from "./app";
import {env} from "./config/secrets";
import {initializeAppServices} from "./utils/init";
import {Server} from "socket.io";
import http from "http";
import registerSocketHandler from "./modules/chat/socket/registerSocketHandler";

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

        const server = http.createServer(app);
        const io = new Server(server, { cors: { origin: "*" } });

        registerSocketHandler(io);

        startServer(app, env.APP_PORT);
    } catch (error) {
        console.error('❌ Error during application startup:', error);
    }
}

startApplication();