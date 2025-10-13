import {Router} from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {messageController} from "../controllers/messageController";

const messageRouter = Router({ mergeParams: true });

messageRouter.post(
    "/",
    accessTokenValidation,
    catchAsync(messageController.sendMessage)
);

messageRouter.get(
    "/",
    accessTokenValidation,
    catchAsync(messageController.getChatMessages)
);

messageRouter.patch(
    "/",
    accessTokenValidation,
    catchAsync(messageController.updateMessage)
);

messageRouter.delete(
    "/",
    accessTokenValidation,
    catchAsync(messageController.deleteMessage)
);

export default messageRouter;