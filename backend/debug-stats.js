import mongoose from 'mongoose';
import Complaint from './models/Complaint.js';
import dotenv from 'dotenv';
dotenv.config();

async function debugStats() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    // Total count
    const total = await Complaint.countDocuments();
    console.log('Total Complaints:', total);
    
    // Group by status
    const statsResult = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    console.log('Stats (Status -> Count):', JSON.stringify(statsResult, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
debugStats();
