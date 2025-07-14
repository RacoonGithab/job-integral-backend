import express from "express";
import {requireRole} from "../middlewares/roleCheckMiddleware";
import {accessTokenValidation} from "../middlewares/accessTokenValidation";
import {validateRequestBody} from "../middlewares/validateRequestBody";
import {updateUserRoleSchema} from "../schema/updateUserRoleSchema";
import {catchAsync} from "../middlewares/catchAsync";
import {updateUserRoleController} from "../controllers/updateUserRoleController";


const updateUserRoleRouter = express.Router();

updateUserRoleRouter.patch(
    "/role",
    accessTokenValidation,
    requireRole('SUPER_ADMIN'),
    validateRequestBody(updateUserRoleSchema),
    catchAsync(updateUserRoleController.updateUserRole)
    )

export default updateUserRoleRouter;