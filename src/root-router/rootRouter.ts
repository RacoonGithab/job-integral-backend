import express from 'express';
import authRouters from "../modules/auth/routers/authRouter";
import resetPasswordRouter from "../modules/reset-password/routers/resetPasswordRouter";
import updateUserRoleRouter from "../modules/auth/routers/updateUserRoleRouter";
import chatRouter from "../modules/chat/routers/rootChatRouter";
import userProfileRouter from "../modules/user-profile/routers/userProfileRouter";
import taskRouter from "../modules/task/routers/taskRouter";
import postRouter from "../modules/post/routers/postRouter";


const rootRouter = express.Router();

rootRouter.use("/auth", authRouters)

rootRouter.use("/reset-password", resetPasswordRouter)

rootRouter.use("/admin", updateUserRoleRouter)

rootRouter.use("/chat", chatRouter);

rootRouter.use("/profile", userProfileRouter);

rootRouter.use("/task", taskRouter);

rootRouter.use("/post", postRouter)

export default rootRouter;