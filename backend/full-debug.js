import mongoose from 'mongoose';
import Complaint from './models/Complaint.js';
import dotenv from 'dotenv';

dotenv.config();

async function fullDebug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    const comp = await Complaint.findOne({ _id: '698db1e7b1d6a5904a986f58' }).lean();
    console.log('Full Complaint Document:');
    console.log(JSON.stringify(comp, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fullDebug();
