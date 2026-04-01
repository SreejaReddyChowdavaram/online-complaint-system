import mongoose from 'mongoose';
import Complaint from './models/Complaint.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkComplaints() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    const resolved = await Complaint.find({ status: 'Resolved' }).limit(5);
    console.log('Latest 5 Resolved Complaints:');
    resolved.forEach(c => {
        console.log(`ID: ${c._id}, Title: ${c.title}, assignedTo: ${c.assignedTo} (Type: ${typeof c.assignedTo})`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkComplaints();
