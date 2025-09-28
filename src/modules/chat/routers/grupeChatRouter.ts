import express from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {groupChatController} from "../controllers/groupChatController";

const groupChatRouter = express.Router();

groupChatRouter.post(
    "/create",
    accessTokenValidation,
    catchAsync(groupChatController.createGroupChat)
)

export default groupChatRouter;