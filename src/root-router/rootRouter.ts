import express from 'express';
import authRouters from "../modules/auth/routers/authRouter";
import resetPasswordRouter from "../modules/reset-password/routers/resetPasswordRouter";
import updateUserRoleRouter from "../modules/auth/routers/updateUserRoleRouter";


const rootRouter = express.Router();

rootRouter.use("/auth", authRouters)

rootRouter.use("/reset-password", resetPasswordRouter)

rootRouter.use("/admin", updateUserRoleRouter)

export default rootRouter;