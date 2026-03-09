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

  password: {
    type: String,
    required: true
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