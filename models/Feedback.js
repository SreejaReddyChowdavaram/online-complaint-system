import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  citizenId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  officerName: { 
    type: String, 
    required: true 
  },
  officerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  department: { 
    type: String, 
    required: true 
  },
  complaintId: { 
    type: String 
  },
  type: { 
    type: String, 
    enum: ["Positive", "Neutral", "Negative"], 
    required: true 
  },
  rating: { 
    type: Number, 
    min: 1, 
    max: 5, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  sentiment: {
    type: String,
    enum: ["Positive", "Neutral", "Negative"],
    required: true
  },
  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public"
  },
  escalated: {
    type: Boolean,
    default: false
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
