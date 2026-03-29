import FollowUp from '../models/FollowUp.js';
import Compliance from '../models/Compliance.js';
import { STATUS } from '../config/constants.js';

export const getTasksByAsha = async (ashaId) => {
    return await FollowUp.find({ ashaId }).populate('patientId', 'name age village');
};

export const getAllMissedCompliance = async () => {
    return await Compliance.find({ status: STATUS.MISSED }).populate('patientId', 'name village');
};

export const completeTask = async (taskId) => {
    const task = await FollowUp.findById(taskId);
    if (!task) {
        throw new Error('Task not found');
    }
    
    if (task.status === STATUS.COMPLETED) {
        return task;
    }

    task.status = STATUS.COMPLETED;
    await task.save();

    await Compliance.create({
        patientId: task.patientId,
        type: task.type,
        status: STATUS.COMPLETED,
        date: new Date()
    });

    return task;
};

export const createTaskForTesting = async (data) => {
    return await FollowUp.create(data);
};
