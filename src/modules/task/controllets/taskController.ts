import {Request, Response} from "express";
import {taskService} from "../services/taskService";

const createTask = async (req: Request, res: Response) => {
    const createdById = req.body.userId;
    const { title, description, dueDate, isUrgent, assignedToId } = req.body;

    await taskService.createTask({
        createdById,
        assignedToId,
        title,
        description,
        dueDate,
        isUrgent,
    });

    res.status(201).json({})
}

const getUserTasks = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const { statusTasks } = req.body

    const tasks = await taskService.getUserTasks({ userId, statusTasks });

    res.status(200).json({tasks})
}

const getTask = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const { taskId } = req.params;

    const task = await taskService.getTask({ userId, taskId });

    res.status(200).json({task})
}

const updateUserTaskStatus = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const { taskId } = req.params;
    const { newStatus } = req.body

    await taskService.updateUserTaskStatus({ userId, taskId, newStatus });

    res.status(201).json({})
}

const deleteTasks = async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const { assignedToId, taskIds } = req.body;

    await taskService.deleteTasks({ userId, taskIds, assignedToId });

    res.status(204).json({})
}

export const taskController = {
    createTask,
    getUserTasks,
    getTask,
    updateUserTaskStatus,
    deleteTasks
}