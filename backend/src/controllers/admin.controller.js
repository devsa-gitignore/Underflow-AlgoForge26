import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';

/**
 * @desc    Get aggregated risk severity data by village/area for heatmap
 * @route   GET /admin/heatmap-data
 * @access  Admin only
 */
export const getHeatmapData = asyncHandler(async (req, res) => {
    // Aggregate patients by village, calculate risk metrics
    const villageStats = await Patient.aggregate([
        {
            $match: { isDeleted: false }
        },
        {
            $group: {
                _id: '$village',
                totalCases: { $sum: 1 },
                highRiskCount: {
                    $sum: {
                        $cond: [{ $eq: ['$currentRiskLevel', 'HIGH'] }, 1, 0]
                    }
                },
                moderateRiskCount: {
                    $sum: {
                        $cond: [{ $eq: ['$currentRiskLevel', 'MODERATE'] }, 1, 0]
                    }
                },
                lowRiskCount: {
                    $sum: {
                        $cond: [{ $eq: ['$currentRiskLevel', 'LOW'] }, 1, 0]
                    }
                }
            }
        },
        {
            $project: {
                village: '$_id',
                _id: 0,
                totalCases: 1,
                highRiskCount: 1,
                moderateRiskCount: 1,
                lowRiskCount: 1,
                // Calculate severity percentage (0-1)
                severityScore: {
                    $divide: [
                        {
                            $add: [
                                { $multiply: ['$highRiskCount', 3] },
                                { $multiply: ['$moderateRiskCount', 1] }
                            ]
                        },
                        { $multiply: ['$totalCases', 3] }
                    ]
                },
                highRiskPercentage: {
                    $multiply: [
                        { $divide: ['$highRiskCount', '$totalCases'] },
                        100
                    ]
                }
            }
        },
        { $sort: { severityScore: -1 } }
    ]);

    // Add mock coordinates for villages (in real app, store in DB or geocode)
    const villageCoordinates = {
        'Panchgani': { lat: 17.9689, lng: 73.8297 },
        'Pune': { lat: 18.5204, lng: 73.8567 },
        'Satara': { lat: 17.6726, lng: 73.9190 },
        'Karad': { lat: 17.3069, lng: 73.5202 },
        'Kolhapur': { lat: 16.7050, lng: 73.7421 },
        'Wai': { lat: 17.5507, lng: 73.6282 },
        'Baramati': { lat: 18.1660, lng: 74.5827 },
        'Mahabaleshwar': { lat: 17.9258, lng: 73.6428 },
        'Lonand': { lat: 17.1833, lng: 74.0500 },
        'Indapur': { lat: 18.1333, lng: 74.1000 }
    };

    // Enrich with coordinates
    const heatmapData = villageStats.map(stat => {
        const coords = villageCoordinates[stat.village] || {
            lat: 17.9 + Math.random() * 2,
            lng: 73.5 + Math.random() * 2
        };
        return {
            ...stat,
            coordinates: coords,
            // Heatmap intensity (0-100)
            intensity: Math.round(stat.severityScore * 100)
        };
    });

    res.status(200).json({
        success: true,
        data: heatmapData,
        summary: {
            totalVillages: heatmapData.length,
            totalCases: heatmapData.reduce((sum, v) => sum + v.totalCases, 0),
            totalHighRisk: heatmapData.reduce((sum, v) => sum + v.highRiskCount, 0),
            averageSeverity: (
                heatmapData.reduce((sum, v) => sum + v.severityScore, 0) / heatmapData.length
            ).toFixed(2)
        }
    });
});

/**
 * @desc    Get detailed breakdown for a specific village
 * @route   GET /admin/village-details/:village
 * @access  Admin only
 */
export const getVillageDetails = asyncHandler(async (req, res) => {
    const { village } = req.params;

    const details = await Patient.find({ village, isDeleted: false })
        .select('name age gender currentRiskLevel phoneNumber createdAt')
        .sort({ currentRiskLevel: -1 });

    const summary = await Patient.aggregate([
        { $match: { village, isDeleted: false } },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                highRisk: {
                    $sum: { $cond: [{ $eq: ['$currentRiskLevel', 'HIGH'] }, 1, 0] }
                },
                moderateRisk: {
                    $sum: { $cond: [{ $eq: ['$currentRiskLevel', 'MODERATE'] }, 1, 0] }
                },
                lowRisk: {
                    $sum: { $cond: [{ $eq: ['$currentRiskLevel', 'LOW'] }, 1, 0] }
                }
            }
        }
    ]);

    res.status(200).json({
        success: true,
        village,
        summary: summary[0] || { total: 0, highRisk: 0, moderateRisk: 0, lowRisk: 0 },
        patients: details
    });
});
