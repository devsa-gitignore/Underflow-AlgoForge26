import asyncHandler from 'express-async-handler';
import { evaluateRisk, generateTimeline, detectEpidemic } from '../services/ai.service.js';
import Patient from '../models/Patient.js';

/**
 * @desc    Analyze patient symptoms and checkup data using AI
 * @route   POST /ai/risk-assessment
 * @access  Public (in hackathon context)
 */
export const analyzeRisk = asyncHandler(async (req, res) => {
    const { bp, weight, bloodSugar, symptoms, otherFactors, patientId } = req.body;

    if (!bp && !weight && !bloodSugar && !symptoms && !otherFactors) {
        res.status(400);
        throw new Error("Please provide at least some checkup data (bp, weight, symptoms, etc.)");
    }

    // Call the AI Service
    const aiResult = await evaluateRisk({ bp, weight, bloodSugar, symptoms, otherFactors });

    let updatedPatientMsg = null;
    
    // Optionally update the patient's risk level directly if an ID was passed
    if (patientId) {
        const patient = await Patient.findById(patientId);
        if (patient) {
            patient.currentRiskLevel = aiResult.riskLevel; // "LOW", "MODERATE", "HIGH"
            await patient.save();
            updatedPatientMsg = `Patient ${patient.name}'s risk level updated to ${patient.currentRiskLevel}.`;
        }
    }

    res.status(200).json({
        success: true,
        data: aiResult,
        message: updatedPatientMsg
    });
});

/**
 * @desc    Generate a pregnancy timeline based on patient age and conditions
 * @route   POST /ai/timeline
 * @access  Public (in hackathon context)
 */
export const getTimeline = asyncHandler(async (req, res) => {
    const { age, lmp, conditions, currentMonth } = req.body;

    if (!age && !currentMonth) {
        res.status(400);
        throw new Error("Please provide at least age and currentMonth for a timeline.");
    }

    const timelineData = await generateTimeline({ age, lmp, conditions, currentMonth });

    res.status(200).json({
        success: true,
        data: timelineData
    });
});

/**
 * @desc    Analyze aggregated region data for epidemics or malnutrition
 * @route   POST /ai/epidemic-alerts
 * @access  Public (in hackathon context)
 */
export const getEpidemicAlerts = asyncHandler(async (req, res) => {
    // In a real app, we'd query MongoDB here to build the aggregated string.
    // E.g., aggregating checkups from the last 7 days in a given village.
    // For the hackathon API, we can either pass the aggregated data from the frontend or test with a dummy string.
    
    const { aggregatedDataText } = req.body;

    if (!aggregatedDataText) {
        res.status(400);
        throw new Error("Please provide 'aggregatedDataText' representing recent health checkups.");
    }

    const alertData = await detectEpidemic(aggregatedDataText);

    res.status(200).json({
        success: true,
        data: alertData
    });
});
