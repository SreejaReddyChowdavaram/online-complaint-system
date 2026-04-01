import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function rawTypeCheck() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    const db = mongoose.connection.db;
    const complaint = await db.collection('complaints').findOne({ _id: new mongoose.Types.ObjectId('698db1e7b1d6a5904a986f58') });
    
    console.log('assignedTo value:', complaint.assignedTo);
    console.log('assignedTo type:', typeof complaint.assignedTo);
    console.log('Is instance of ObjectId:', (complaint.assignedTo instanceof mongoose.Types.ObjectId));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

rawTypeCheck();
