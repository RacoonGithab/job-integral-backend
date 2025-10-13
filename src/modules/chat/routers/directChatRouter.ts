import express from "express";
import {catchAsync} from "../../../middlewares/catchAsync";
import {directChatController} from "../controllers/directChatController";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import messageRouter from "./messageRouter";
import chatMembersRouter from "./chatMembersRouter";

const directChatRouter = express.Router();

directChatRouter.post(
    "/create",
    accessTokenValidation,
    catchAsync(directChatController.createDirectChat)
);

directChatRouter.post(
    "/:chatId/leave",
    accessTokenValidation,
    catchAsync(directChatController.leaveDirectChat)
)

directChatRouter.use(
    "/:chatId/message",
    messageRouter
);


directChatRouter.use(
    "/:chatId/members",
    chatMembersRouter
);

export default directChatRouter;