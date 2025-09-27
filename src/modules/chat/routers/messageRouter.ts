import {Router} from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {messageController} from "../controllers/messageController";

const messageRouter = Router({ mergeParams: true });

messageRouter.post(
    "/",
    accessTokenValidation,
    catchAsync(messageController.sendMessage)
)

export default messageRouter;