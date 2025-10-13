import express from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {groupChatController} from "../controllers/groupChatController";
import messageRouter from "./messageRouter";
import chatMembersRouter from "./chatMembersRouter";

const groupChatRouter = express.Router();

groupChatRouter.post(
    "/create",
    accessTokenValidation,
    catchAsync(groupChatController.createGroupChat)
);

groupChatRouter.post(
    "/:chatId/leave",
    accessTokenValidation,
    catchAsync(groupChatController.leaveGroupChat)
);

groupChatRouter.delete(
    "/:chatId",
    accessTokenValidation,
    catchAsync(groupChatController.deleteGroupChat)
)

groupChatRouter.use(
    "/:chatId/message",
    messageRouter
)

groupChatRouter.use(
    "/:chatId/members",
    chatMembersRouter
);

export default groupChatRouter;