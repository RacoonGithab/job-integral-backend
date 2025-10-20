import express from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {userProfileController} from "../controllers/userProfileController";
import {validateRequestBody} from "../../../middlewares/validateRequestBody";
import {createProfileSchema} from "../schema/createProfileSchema";
import {upload} from "../../../config/multerConfig";
import {validateImageFile} from "../../../middlewares/validateAvatarFile";

const userProfileRouter = express.Router();

userProfileRouter.post(
    "/",
    upload.single("avatar"),
    accessTokenValidation,
    validateImageFile,
    validateRequestBody(createProfileSchema),
    catchAsync(userProfileController.createUserprofile)
);

userProfileRouter.patch(
    "/",
    upload.single("avatar"),
    accessTokenValidation,
    validateImageFile,
    validateRequestBody(createProfileSchema.partial()),
    catchAsync(userProfileController.updateUserProfile)
);

userProfileRouter.get(
    "/",
    accessTokenValidation,
    catchAsync(userProfileController.getUserProfile)
)

export default userProfileRouter;