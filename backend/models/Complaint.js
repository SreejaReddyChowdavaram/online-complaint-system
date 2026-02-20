import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    location: {
      lat: Number,
      lng: Number,
    },

    images: [String],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    // 🔥 NEW FIELD
    resolutionImage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

complaintSchema.index({ status: 1 });
complaintSchema.index({ assignedTo: 1 });

export default mongoose.model("Complaint", complaintSchema);
