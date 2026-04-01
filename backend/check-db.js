import mongoose from 'mongoose';
import Feedback from './models/Feedback.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkFeedback() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    const latest = await Feedback.find().sort({ submittedAt: -1 }).limit(5);
    console.log('Latest 5 Feedbacks:');
    console.log(JSON.stringify(latest, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkFeedback();
