import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://jashnikumbhe:jash2006@cluster0.89pu6ly.mongodb.net/?appName=Cluster0');
    console.log('CONNECTED TO DB');

    console.log('Syncing indexes to drop legacy schema constraints...');
    await User.syncIndexes(); // Drops the obsolete unique 'phoneNumber' index

    const extraNames = ['Priya Patel', 'Sunita Devi', 'Meena Kumari', 'Kavita Singh', 'Anjali Desai', 'Neha Gupta', 'Rani Mukerji', 'Ankita Lokhande', 'Swara Bhaskar'];
    const extraWards = ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'];
    
    // remove everyone but Jash
    await User.deleteMany({ role: 'ASHA', phone: { $ne: '9876543210' } });

    for (let i = 0; i < extraNames.length; i++) {
        try {
            await User.create({
                name: extraNames[i],
                phone: `922220000${i}`, // Unique phones
                region: extraWards[Math.floor(Math.random() * extraWards.length)],
                role: 'ASHA',
                isVerified: true
            });
            console.log(`Created ${extraNames[i]}`);
        } catch(e) {
            console.error(`Failed on ${extraNames[i]}: ${e.message}`);
        }
    }
    
    console.log('DONE SEEDING MULTIPLE WORKERS');
  } catch (err) {
    console.error('Fatal error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

seed();
