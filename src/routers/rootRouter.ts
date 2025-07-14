import express from 'express';
import authRouters from "./authRouter";
import resetPasswordRouter from "./resetPasswordRouter";
import updateUserRoleRouter from "./updateUserRoleRouter";


const rootRouter = express.Router();

rootRouter.use("/auth", authRouters)

rootRouter.use("/reset-password", resetPasswordRouter)

rootRouter.use("/admin", updateUserRoleRouter)

export default rootRouter;