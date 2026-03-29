import express from 'express';
import { getAshaTasks } from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.get('/:id/tasks', getAshaTasks);

export default router;
