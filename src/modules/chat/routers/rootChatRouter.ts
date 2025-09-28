import express from "express";
import directChatRouter from "./directChatRouter";
import groupChatRouter from "./grupeChatRouter";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {chatController} from "../controllers/chatController";

const chatRouter = express.Router();

chatRouter.use("/direct", directChatRouter);

chatRouter.use("/group", groupChatRouter);


chatRouter.get("/", accessTokenValidation, catchAsync(chatController.getUserActiveChats));

chatRouter.get("/:chatId", accessTokenValidation, catchAsync(chatController.getUserChat));

export default chatRouter;