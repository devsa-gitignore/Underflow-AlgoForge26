import asyncHandler from 'express-async-handler';
import * as taskService from '../services/task.service.js';

// @desc    Get tasks by ASHA ID
// @route   GET /asha/:id/tasks
// @access  Private
export const getAshaTasks = asyncHandler(async (req, res) => {
    const ashaId = req.params.id === 'me' ? req.user._id : req.params.id;
    const tasks = await taskService.getTasksByAsha(ashaId);
    res.status(200).json({ success: true, tasks });
});

// @desc    Mark task as completed
// @route   PATCH /tasks/:id
// @access  Private
export const completeTask = asyncHandler(async (req, res) => {
    const task = await taskService.completeTask(req.params.id);
    res.status(200).json({ success: true, task });
});

// @desc    Create a task (For testing purposes)
// @route   POST /tasks
// @access  Private
export const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTaskForTesting(req.body);
    res.status(201).json({ success: true, task });
});
