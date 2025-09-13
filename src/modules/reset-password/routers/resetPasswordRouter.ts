import express  from "express";
import {resetPasswordController} from "../controllers/resetPaswordController";
import {validateRequestBody} from "../../../middlewares/validateRequestBody";
import {resetPasswordSchema} from "../schema/resetPasswordSchema";
import {catchAsync} from "../../../middlewares/catchAsync";
import {validateResetPasswordToken} from "../../../middlewares/validateResetPasswordToken";
import {verifyPasswordResetCodeSchema} from "../schema/verifyPasswordResetCodeSchema";
import {requestPasswordResetSchema} from "../schema/requestPasswordResetSchema";

const resetPasswordRouter = express.Router();

resetPasswordRouter.post(
    "/request",
    validateRequestBody(requestPasswordResetSchema),
    catchAsync(resetPasswordController.requestResetPassword)
)

resetPasswordRouter.post(
    "/verify-otp",
    validateRequestBody(verifyPasswordResetCodeSchema),
    validateResetPasswordToken,
    catchAsync(resetPasswordController.verifyResetPasswordCode)
)

resetPasswordRouter.post(
    "/",
    validateRequestBody(resetPasswordSchema),
    validateResetPasswordToken,
    catchAsync(resetPasswordController.resetPassword)
);

export default resetPasswordRouter;