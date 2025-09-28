import express from "express";
import {catchAsync} from "../../../middlewares/catchAsync";
import {directChatController} from "../controllers/directChatController";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import messageRouter from "./messageRouter";

const directChatRouter = express.Router();

directChatRouter.post(
    "/create",
    accessTokenValidation,
    catchAsync(directChatController.createDirectChat)
);

directChatRouter.delete(
    "/:chatId",
    accessTokenValidation,
    catchAsync(directChatController.leaveDirectChat)
)

directChatRouter.use(
    "/:chatId/message",
    messageRouter
);

export default directChatRouter;