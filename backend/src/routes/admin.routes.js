import express from 'express';
import { getSeverityHeatmap } from '../controllers/admin.controller.js';

const router = express.Router();

router.get('/severity-heatmap', getSeverityHeatmap);

export default router;
