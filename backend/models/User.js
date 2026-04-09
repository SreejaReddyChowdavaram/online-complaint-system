import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    unique: true,
    index: true,
    required: true
  },

  phone: String,
  mobile: String,
  department: String,
  avatar: String,
  profilePic: String,
  assignedArea: { type: String, default: "" },
  currentActiveComplaints: { type: Number, default: 0 },
  completedCases: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  cumulativeRating: { type: Number, default: 0 },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },

  provider: {
    type: String,
    enum: ["local", "google"],
    default: "local"
  },

  password: {
    type: String,
    required: false
  },

  role: {
    type: String,
    enum: ["Citizen","Officer","Admin"],
    default: "Citizen"
  },

  otp: String,
  otpExpiry: Date

});

export default mongoose.models.User || mongoose.model("User", userSchema);