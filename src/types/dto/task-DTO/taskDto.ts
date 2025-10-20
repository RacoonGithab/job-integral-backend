import {TaskStatus} from "@prisma/client";

export interface createTaskDto {
    createdById: string;
    assignedToId: string;
    title: string;
    description: string;
    dueDate: Date;
    isUrgent: boolean;
}

export interface getUserTasksDto {
    userId: string;
    statusTasks: TaskStatus;
}

export interface getTaskDto {
    userId: string;
    taskId: string;
}

export interface deleteTasksDto {
    userId: string;
    taskIds: string[];
    assignedToId: string;
}

export interface updateTaskStatusDto {
    userId: string;
    taskId: string;
    newStatus: TaskStatus;
}