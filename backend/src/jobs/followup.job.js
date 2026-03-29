import FollowUp from '../models/FollowUp.js';
import Compliance from '../models/Compliance.js';
import Alert from '../models/Alert.js';
import { STATUS, SEVERITY } from '../config/constants.js';

export const startFollowUpJob = () => {
    // Run every 5 minutes
    setInterval(async () => {
        try {
            const now = new Date();
            // Find all pending follow-ups that are overdue
            const overdueFollowUps = await FollowUp.find({
                status: STATUS.PENDING,
                dueDate: { $lt: now }
            });

            if (overdueFollowUps.length === 0) return;

            for (const followUp of overdueFollowUps) {
                // Update FollowUp to MISSED
                followUp.status = STATUS.MISSED;
                await followUp.save();

                // Create Compliance record
                await Compliance.create({
                    patientId: followUp.patientId,
                    type: followUp.type,
                    status: STATUS.MISSED,
                    date: now
                });

                // Create Alert
                await Alert.create({
                    patientId: followUp.patientId,
                    ashaId: followUp.ashaId,
                    type: 'MISSED_FOLLOWUP',
                    message: `Patient missed follow-up`,
                    severity: SEVERITY.HIGH,
                    status: STATUS.ACTIVE
                });
            }
            console.log(`[Follow-up Job] Processed ${overdueFollowUps.length} overdue follow-ups`);
        } catch (error) {
            console.error('[Follow-up Job] Error:', error);
        }
    }, 5 * 60 * 1000);
    
    console.log('[Follow-up Job] Started');
};
