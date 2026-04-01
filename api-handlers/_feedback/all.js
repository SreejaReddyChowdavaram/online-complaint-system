import dbConnect from "../../lib/db.js";
import Feedback from "../../models/Feedback.js";
import { withAuth } from "../../lib/authMiddleware.js";

const handler = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await dbConnect();
    const { department, rating } = req.query;
    let query = {};
    if (department) query.department = department;
    if (rating) query.rating = parseInt(rating);

    const feedback = await Feedback.find(query)
      .populate("officerId", "name department")
      .populate("citizenId", "name")
      .sort({ submittedAt: -1 });

    // Aggregate officer stats for Admin Analytics
    const aggregatePipeline = [];
    if (department) aggregatePipeline.push({ $match: { department } });
    
    aggregatePipeline.push(
      {
        $group: {
          _id: "$officerId",
          count: { $sum: 1 },
          avgRating: { $avg: "$rating" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "officer"
        }
      },
      { $unwind: "$officer" },
      {
        $project: {
          _id: 1,
          avgRating: 1,
          count: 1,
          name: "$officer.name",
          dept: "$officer.department"
        }
      },
      { $sort: { avgRating: -1 } }
    );

    const officerStats = await Feedback.aggregate(aggregatePipeline);

    return res.status(200).json({ feedback, officerStats });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export default withAuth(handler, ["Admin"]);
