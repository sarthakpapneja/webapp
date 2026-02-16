import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task';

interface FuncRequest extends Request {
    user?: any;
}

export const getTasks = async (req: FuncRequest, res: Response) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const createTask = async (req: FuncRequest, res: Response) => {
    if (!req.body.title) {
        res.status(400).json({ message: 'Please add a title' });
        return;
    }

    try {
        const task = await Task.create({
            title: req.body.title,
            description: req.body.description,
            user: req.user.id,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const updateTask = async (req: FuncRequest, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedTask);
};

export const deleteTask = async (req: FuncRequest, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
        res.status(404).json({ message: 'Task not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the task user
    if (task.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await task.deleteOne();

    res.status(200).json({ id: req.params.id });
};
