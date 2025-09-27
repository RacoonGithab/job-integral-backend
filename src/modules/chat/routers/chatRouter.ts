import express from "express";
import {catchAsync} from "../../../middlewares/catchAsync";
import {chatController} from "../controllers/chatController";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import messageRouter from "./messageRouter";

const chatRouter = express.Router();

chatRouter.get(
    "/",
    accessTokenValidation,
    catchAsync(chatController.getUserActiveChats)
)

chatRouter.get(
    "/:chatId",
    accessTokenValidation,
    catchAsync(chatController.getUserChat)
)

chatRouter.post(
    "/create",
    accessTokenValidation,
    catchAsync(chatController.createPrivateChat)
);

chatRouter.post(
    "/create-group",
    accessTokenValidation,
    catchAsync(chatController.createGroupChat)
)

chatRouter.use(
    "/:chatId/message",
    messageRouter
);

export default chatRouter;