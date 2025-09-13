import express, {Express} from "express";
import morgan from "morgan";
import rootRouters from "./root-router/rootRouter"
import {errorHandler} from "./middlewares/errorHandler";


export const createApp = ():Express => {
    const app = express();
    app.use(morgan("combined"))
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ extended: true, limit: '5mb' }));
    app.use("/api/v1", rootRouters)
    app.use(errorHandler)
    return app;
}