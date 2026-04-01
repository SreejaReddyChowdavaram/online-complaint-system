import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Complaint from './models/Complaint.js';

dotenv.config();

async function testJoin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/jan-suvidha');
    console.log('Connected to DB');
    
    const complaints = await Complaint.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId('698db1e7b1d6a5904a986f58') } },
      {
        $lookup: {
          from: "users",
          localField: "assignedTo",
          foreignField: "_id",
          as: "assignedTo"
        }
      },
      {
        $unwind: {
          path: "$assignedTo",
          preserveNullAndEmptyArrays: true
        }
      }
    ]);

    console.log('Aggregation Output:');
    console.log(JSON.stringify(complaints, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

testJoin();
