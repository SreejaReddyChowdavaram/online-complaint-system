import mongoose from 'mongoose';
import Complaint from './models/Complaint.js';
import Feedback from './models/Feedback.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function fixData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    // 1. Fix Complaints: Auto-assign Resolved complaints to a relevant officer
    const resolvedWithoutOfficer = await Complaint.find({ status: 'Resolved', assignedTo: null });
    console.log(`Found ${resolvedWithoutOfficer.length} resolved complaints without an officer.`);

    for (const c of resolvedWithoutOfficer) {
      // Find an officer in that department
      const officer = await User.findOne({ role: 'Officer', department: c.category });
      // Fallback: search by name in other fields or just find ANY officer if only one exists in the system
      let targetOfficer = officer;
      if (!targetOfficer) {
          targetOfficer = await User.findOne({ role: 'Officer' });
      }

      if (targetOfficer) {
        console.log(`Assigning complaint "${c.title}" to officer "${targetOfficer.name}"`);
        c.assignedTo = targetOfficer._id;
        await c.save();
      }
    }

    // 2. Fix Feedbacks: Update orphaned feedbacks with officerId and officerName
    const feedbackOrphans = await Feedback.find({ officerId: null });
    console.log(`Found ${feedbackOrphans.length} orphaned feedback entries.`);

    for (const f of feedbackOrphans) {
        // Find the complaint this feedback is for
        const comp = await Complaint.findById(f.complaintId);
        if (comp && comp.assignedTo) {
            const officer = await User.findById(comp.assignedTo);
            if (officer) {
                console.log(`Updating feedback #${f._id} with officer "${officer.name}"`);
                f.officerId = officer._id;
                f.officerName = officer.name;
                f.department = officer.department || comp.category;
                await f.save();
            }
        }
    }

    console.log('Data cleanup complete.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

fixData();
