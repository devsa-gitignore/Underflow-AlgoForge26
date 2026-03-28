import express from 'express';
import {
  sendOTP,
  login,
  getMe,
  devToken,
  getWorkers,
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/dev-token', devToken);
router.get('/workers', getWorkers);

// Hackathon dynamic local seed via active connection to bypass DNS failure 
router.get('/seed-workers', async (req, res) => {
    try {
        const User = (await import('../models/User.js')).default;
        
        // Drop any corrupt users lacking a phone number or ASHA workers we previously generated
        await User.deleteMany({ $or: [{ phone: { $exists: false } }, { phone: null }] });
        await User.deleteMany({ role: 'ASHA', phone: { $ne: '9876543210' } });
        
        await User.syncIndexes();
        
        const extraNames = ['Priya Patel', 'Sunita Devi', 'Meena Kumari', 'Kavita Singh', 'Anjali Desai', 'Neha Gupta', 'Rani Mukerji', 'Ankita Lokhande', 'Swara Bhaskar'];
        const extraWards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
        
        await User.deleteMany({ role: 'ASHA', phone: { $ne: '9876543210' } });
        
        for (let i = 0; i < extraNames.length; i++) {
            await User.create({
                name: extraNames[i],
                phone: `922220000${i}`,
                region: extraWards[Math.floor(Math.random() * extraWards.length)],
                role: 'ASHA',
                isVerified: true
            });
        }
        res.status(200).json({ success: true, message: 'Seeded 9 workers successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
