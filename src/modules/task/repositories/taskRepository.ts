import {prismaClient} from "../../../config/prismaClient";
import {
    getUserTasksRepoDto,
    createTaskDto,
    taskRepoDto,
    deleteTasksIdsRepoDto, updateTaskStatusRepoDto
} from "../../../types/dto/task-DTO/taskRepoDto";
import {Task, TaskStatus} from "@prisma/client";


const createTaskByUserId = async (data: createTaskDto): Promise<void> => {
    await prismaClient.task.create({ data });
}

const getUserTasksById = async (data: getUserTasksRepoDto): Promise<Task[]> => {
    return prismaClient.task.findMany({
        where: {
            assignedToId: data.userId,
            ...(data.status ? { status: data.status } : {}),
        },
    });
}

const getTaskById = async (data: taskRepoDto): Promise<Task | null> => {
    return prismaClient.task.findUnique({
        where: {
            id: data.taskId,
            assignedToId: data.userId,
        }
    });
}

const updateTaskStatusById = async (data: updateTaskStatusRepoDto): Promise<void> => {
    await prismaClient.task.update({
        where: {
            assignedToId: data.userId,
            id: data.taskId
        },
        data: { status: data.newStatus },
    });
}

const deleteTasksByIds = async (data: deleteTasksIdsRepoDto): Promise<void> => {
    await prismaClient.task.deleteMany({
        where: {
            id: { in: data.taskIds },
            assignedToId: data.assignedToId,
        },
    });
}

export const taskRepository = {
    createTaskByUserId,
    getUserTasksById,
    getTaskById,
    updateTaskStatusById,
    deleteTasksByIds
}