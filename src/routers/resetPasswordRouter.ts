import express  from "express";
import {resetPasswordController} from "../controllers/resetPaswordController";
import {validateRequestBody} from "../middlewares/validateRequestBody";
import {resetPasswordSchema} from "../schema/resetPasswordSchema";
import {catchAsync} from "../middlewares/catchAsync";
import {validateResetPasswordToken} from "../middlewares/validateResetPasswordToken";

const resetPasswordRouter = express.Router();

resetPasswordRouter.post(
    "/",
    validateRequestBody(resetPasswordSchema),
    validateResetPasswordToken,
    catchAsync(resetPasswordController.resetPassword)
);

export default resetPasswordRouter;