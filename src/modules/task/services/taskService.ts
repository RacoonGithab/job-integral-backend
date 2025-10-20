import {
    createTaskDto,
    deleteTasksDto,
    getTaskDto,
    getUserTasksDto,
    updateTaskStatusDto
} from "../../../types/dto/task-DTO/taskDto";
import {userRepository} from "../../auth/repositories/userRepository";
import ApiError from "../../../error/ApiError";
import {error} from "../../../utils/constants/errorMasseges";
import {taskRepository} from "../repositories/taskRepository";
import {Task, TaskStatus} from "@prisma/client";
import {as} from "@faker-js/faker/dist/airline-CHFQMWko";


const createTask = async (data: createTaskDto): Promise<void> => {
    const creatorToDb = await userRepository.getUserById(data.createdById);

    if (!creatorToDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (creatorToDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }

    const assignedDb = await userRepository.getUserById(data.assignedToId);

    if (!assignedDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (assignedDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }

    await taskRepository.createTaskByUserId({
        assignedToId: data.assignedToId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
        isUrgent: data.isUrgent,
        createdAt: new Date(),
    });
}

const getUserTasks = async (data: getUserTasksDto): Promise<Task[]> => {
    const userDb = await userRepository.getUserById(data.userId)

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }

    return taskRepository.getUserTasksById({
        userId: data.userId,
        status: data.statusTasks
    })
}

const getTask = async (data: getTaskDto): Promise<Task> => {
    const userDb = await userRepository.getUserById(data.userId)

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }

    const taskDb = await taskRepository.getTaskById({
        userId: data.userId,
        taskId: data.taskId
    });

    if (!taskDb) {
        throw new ApiError(404, error.NOT_FOUND)
    }

    return taskDb;
}

const updateUserTaskStatus = async (data: updateTaskStatusDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId)

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }

    const taskDb = await taskRepository.getTaskById({
        taskId: data.taskId,
        userId: data.userId
    })

    if (!taskDb) {
        throw new ApiError(404, error.NOT_FOUND)
    }

    if (taskDb.assignedToId !== data.userId) {
        throw new ApiError(403, error.FORBIDDEN);
    }

    const validTransition =
        (taskDb.status === TaskStatus.ACTIVE && data.newStatus === TaskStatus.COMPLETED) ||
        (taskDb.status === TaskStatus.COMPLETED && data.newStatus === TaskStatus.ACTIVE);

    if (!validTransition) {
        throw new ApiError(400, error.INVALID_STATUS);
    }

    await taskRepository.updateTaskStatusById({
        userId: data.userId,
        taskId: data.taskId,
        newStatus: data.newStatus
    })
}

const deleteTasks = async (data: deleteTasksDto): Promise<void> => {
    const userDb = await userRepository.getUserById(data.userId)

    if (!userDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (userDb.isBlocked) {
        throw new ApiError(403, error.USER_BLOCKED)
    }

    const assignedToDb = await userRepository.getUserById(data.assignedToId);

    if (!assignedToDb) {
        throw new ApiError(404, error.USER_NOT_FOUND)
    }

    if (!data.taskIds || data.taskIds.length === 0) {
        throw new ApiError(400, error.NOT_FOUND);
    }

    await taskRepository.deleteTasksByIds({
        taskIds: data.taskIds,
        assignedToId: data.assignedToId
    })
}

export const taskService = {
    createTask,
    getUserTasks,
    getTask,
    updateUserTaskStatus,
    deleteTasks
}