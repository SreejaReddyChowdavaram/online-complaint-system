import mongoose from 'mongoose';
import Complaint from './models/Complaint.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function forceFix() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    const officer = await User.findOne({ name: 'officer1' });
    if (!officer) {
        console.error('Officer1 not found');
        process.exit(1);
    }
    
    // Force assign ALL resolved complaints in Electricity category to officer1
    const result = await Complaint.updateMany(
        { category: 'Electricity', status: 'Resolved', assignedTo: null },
        { $set: { assignedTo: officer._id } }
    );
    
    console.log(`Updated ${result.modifiedCount} complaints.`);
    
    // Also fix any feedback that was orphaned
    const fbResult = await Complaint.find({ assignedTo: officer._id });
    const complaintIds = fbResult.map(c => c._id.toString());
    
    const feedbackFix = await mongoose.connection.collection('feedbacks').updateMany(
        { complaintId: { $in: complaintIds }, officerId: null },
        { $set: { officerId: officer._id, officerName: officer.name, department: officer.department } }
    );
    console.log(`Updated ${feedbackFix.modifiedCount} feedback entries.`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

forceFix();
