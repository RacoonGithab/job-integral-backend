import {Router} from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {messageController} from "../controllers/messageController";
import { upload} from "../../../config/multerConfig";
import {validateMessageFiles} from "../../../middlewares/fileValidation";
import {fireBaseConstants} from "../../../utils/constants/fireBaseConstatnts";

const messageRouter = Router({ mergeParams: true });

messageRouter.post(
    "/",
    upload.array('files', fireBaseConstants.MAXIMUM_NUMBER_OF_FILES),
    accessTokenValidation,
    validateMessageFiles,
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