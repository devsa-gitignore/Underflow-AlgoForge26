import express from 'express';
import { getHeatmapData, getVillageDetails } from '../controllers/admin.controller.js';

const router = express.Router();

// Heatmap data for all villages
router.get('/heatmap-data', getHeatmapData);

// Detailed breakdown for a specific village
router.get('/village-details/:village', getVillageDetails);

export default router;
