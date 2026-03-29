import express from 'express';
import { completeTask, createTask } from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.post('/', createTask); // For testing
router.patch('/:id', completeTask);

export default router;
