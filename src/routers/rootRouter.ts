import express from 'express';
import authRouters from "./authRouter";


const rootRouter = express.Router();

rootRouter.use("/auth", authRouters)

export default rootRouter;