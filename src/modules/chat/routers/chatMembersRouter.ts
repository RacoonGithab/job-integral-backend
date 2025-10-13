import express from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {chatMembersController} from "../controllers/chatMembersController";

const chatMembersRouter = express.Router({ mergeParams: true });

chatMembersRouter.post(
    "/",
    accessTokenValidation,
    catchAsync(chatMembersController.addChatMember)
);

chatMembersRouter.get(
    "/",
    accessTokenValidation,
    catchAsync(chatMembersController.getChatMembers),
);


export default chatMembersRouter;