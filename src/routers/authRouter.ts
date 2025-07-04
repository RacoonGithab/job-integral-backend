import express from 'express';
import {authController} from "../controllers/authController";
import {catchAsync} from "../middlewares/catchAsync";
import {validateRequestBody} from "../middlewares/validateRequestBody";
import {loginSchema} from "../schema/logineSchema";

const authRouters = express.Router();

authRouters.post("/login", validateRequestBody(loginSchema), catchAsync(authController.login));

export default authRouters;