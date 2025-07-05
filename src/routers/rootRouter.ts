import express from 'express';
import authRouters from "./authRouter";
import resetPasswordRouter from "./resetPasswordRouter";


const rootRouter = express.Router();

rootRouter.use("/auth", authRouters)

rootRouter.use("/reset-password", resetPasswordRouter)

export default rootRouter;