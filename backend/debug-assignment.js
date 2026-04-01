import mongoose from 'mongoose';
import Complaint from './models/Complaint.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function debugAssignment() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    const comp = await Complaint.findOne({ _id: '698db1e7b1d6a5904a986f58' });
    console.log(`Complaint Category: "${comp.category}"`);
    
    const officers = await User.find({ role: 'Officer' }).select('name department');
    console.log('All Officers with Departments:');
    console.log(JSON.stringify(officers, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

debugAssignment();
