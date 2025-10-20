import {TaskStatus} from "@prisma/client";

export interface createTaskDto {
    assignedToId: string;
    title: string;
    description: string;
    dueDate: Date;
    isUrgent: boolean;
    createdAt: Date;
}

export interface getUserTasksRepoDto {
    userId: string;
    status: TaskStatus;
}

export interface taskRepoDto {
    taskId: string;
    userId: string;
}

export interface deleteTasksIdsRepoDto {
    taskIds: string[];
    assignedToId: string;
}

export interface updateTaskStatusRepoDto {
    userId: string;
    taskId: string;
    newStatus: TaskStatus;
}