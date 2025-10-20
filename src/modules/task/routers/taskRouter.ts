import express from "express";
import {accessTokenValidation} from "../../../middlewares/accessTokenValidation";
import {catchAsync} from "../../../middlewares/catchAsync";
import {validateRequestBody} from "../../../middlewares/validateRequestBody";
import {requireRole} from "../../../middlewares/roleCheckMiddleware";
import {taskController} from "../controllets/taskController";
import {createTaskSchema} from "../schema/createTaskSchema";

const taskRouter = express.Router();

taskRouter.post(
    "/",
    accessTokenValidation,
    requireRole("ADMIN"),
    validateRequestBody(createTaskSchema),
    catchAsync(taskController.createTask)
);

taskRouter.get(
    "/",
    accessTokenValidation,
    catchAsync(taskController.getUserTasks)
);

taskRouter.get(
    "/:taskId",
    accessTokenValidation,
    catchAsync(taskController.getTask)
);

taskRouter.patch(
    "/:taskId",
    accessTokenValidation,
    catchAsync(taskController.updateUserTaskStatus)
)

taskRouter.delete(
    "/",
    accessTokenValidation,
    requireRole("ADMIN"),
    catchAsync(taskController.deleteTasks)
);

export default taskRouter;