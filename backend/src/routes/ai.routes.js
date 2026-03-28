import express from 'express';
import { analyzeRisk, getTimeline, getEpidemicAlerts } from '../controllers/ai.controller.js';

const router = express.Router();

router.post('/risk-assessment', analyzeRisk);
router.post('/timeline', getTimeline);
router.post('/epidemic-alerts', getEpidemicAlerts);

export default router;
