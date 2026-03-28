import asyncHandler from 'express-async-handler';
import Patient from '../models/Patient.js';

const RISK_WEIGHTS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
};

const toTitle = (value) => {
  if (!value || typeof value !== 'string') return 'Unknown';
  return value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

export const getSeverityHeatmap = asyncHandler(async (_req, res) => {
  const pipeline = [
    { $match: { isDeleted: false } },
    {
      $project: {
        area: {
          $ifNull: ['$region', '$village'],
        },
        risk: {
          $ifNull: ['$currentRiskLevel', 'LOW'],
        },
      },
    },
    {
      $group: {
        _id: {
          $ifNull: ['$area', 'Unknown'],
        },
        totalCases: { $sum: 1 },
        lowCases: {
          $sum: {
            $cond: [{ $eq: ['$risk', 'LOW'] }, 1, 0],
          },
        },
        mediumCases: {
          $sum: {
            $cond: [{ $eq: ['$risk', 'MEDIUM'] }, 1, 0],
          },
        },
        highCases: {
          $sum: {
            $cond: [{ $eq: ['$risk', 'HIGH'] }, 1, 0],
          },
        },
        criticalCases: {
          $sum: {
            $cond: [{ $eq: ['$risk', 'CRITICAL'] }, 1, 0],
          },
        },
      },
    },
    {
      $addFields: {
        weightedScore: {
          $add: [
            { $multiply: ['$lowCases', RISK_WEIGHTS.LOW] },
            { $multiply: ['$mediumCases', RISK_WEIGHTS.MEDIUM] },
            { $multiply: ['$highCases', RISK_WEIGHTS.HIGH] },
            { $multiply: ['$criticalCases', RISK_WEIGHTS.CRITICAL] },
          ],
        },
      },
    },
    {
      $addFields: {
        severityIndex: {
          $cond: [
            { $gt: ['$totalCases', 0] },
            {
              $divide: ['$weightedScore', { $multiply: ['$totalCases', RISK_WEIGHTS.CRITICAL] }],
            },
            0,
          ],
        },
      },
    },
    { $sort: { severityIndex: -1, criticalCases: -1, totalCases: -1 } },
  ];

  const rows = await Patient.aggregate(pipeline);

  const data = rows.map((row) => ({
    area: toTitle(row._id),
    totalCases: row.totalCases,
    lowCases: row.lowCases,
    mediumCases: row.mediumCases,
    highCases: row.highCases,
    criticalCases: row.criticalCases,
    weightedScore: row.weightedScore,
    severityIndex: Number((row.severityIndex || 0).toFixed(4)),
  }));

  const summary = data.reduce(
    (acc, item) => {
      acc.totalAreas += 1;
      acc.totalCases += item.totalCases;
      acc.totalCritical += item.criticalCases;
      acc.maxSeverity = Math.max(acc.maxSeverity, item.severityIndex);
      return acc;
    },
    { totalAreas: 0, totalCases: 0, totalCritical: 0, maxSeverity: 0 }
  );

  res.status(200).json({
    success: true,
    summary,
    data,
  });
});
