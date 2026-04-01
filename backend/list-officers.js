import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function checkOfficers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    const officers = await User.find({ role: 'Officer' }).select('name department');
    console.log('List of Officers:');
    console.log(JSON.stringify(officers, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkOfficers();
