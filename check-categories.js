import mongoose from 'mongoose';
import './backend/config/loadEnv.js';
import Complaint from './backend/models/Complaint.js';
import connectDB from './backend/config/database.js';

const checkCategories = async () => {
  await connectDB();
  const complaints = await Complaint.find().select('category title');
  const categories = [...new Set(complaints.map(c => c.category))];
  console.log('Unique Categories in DB:', categories);
  process.exit();
};

checkCategories();
