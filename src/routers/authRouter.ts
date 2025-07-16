import express from 'express';
import {authController} from "../controllers/authController";
import {catchAsync} from "../middlewares/catchAsync";
import {validateRequestBody} from "../middlewares/validateRequestBody";
import {loginSchema} from "../schema/logineSchema";
import {verifyLoginCodeSchema} from "../schema/verifyLoginCodeSchema";
import {refreshTokenValidation} from "../middlewares/refreshTokenValidation";
import {accessTokenValidation} from "../middlewares/accessTokenValidation";

const authRouters = express.Router();

authRouters.post(
    "/login",
    validateRequestBody(loginSchema),
    catchAsync(authController.loginUser)
);

authRouters.post(
    "/verify-login-code",
    validateRequestBody(verifyLoginCodeSchema),
    catchAsync(authController.verifyLoginCode)

);

authRouters.post(
    "/refresh",
    refreshTokenValidation,
    authController.refreshTokens
);

authRouters.post(
    "/logout",
    accessTokenValidation,
    authController.logoutUser
);

export default authRouters;