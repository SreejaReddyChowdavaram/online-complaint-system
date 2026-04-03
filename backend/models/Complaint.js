import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },

    location: {
      address: { type: String, default: "" },
      lat: Number,
      lng: Number,
    },

    imageUrl: { type: String, default: null },
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

    assignedAt: {
      type: Date,
      default: null,
    },

    escalationSent: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Pending", "Assigned", "In Progress", "Resolved"],
      default: "Pending",
    },

    resolutionImage: {
      type: String,
      default: null,
    },

    // ✅ Votes
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },

    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        voteType: {
          type: String,
          enum: ["upvote", "downvote"],
        },
      },
    ],
  },
  { timestamps: true }
);

// ✅ Pre-validate hook to normalize status and fallback missing required fields
// This must be 'validate' (not 'save') because enum checks run during validation.
complaintSchema.pre("validate", function (next) {
  // Normalize Status
  if (this.status) {
    const statusMap = {
      pending: "Pending",
      assigned: "Assigned",
      "in progress": "In Progress",
      "in-progress": "In Progress",
      in_progress: "In Progress",
      resolved: "Resolved",
    };
    const lower = this.status.toLowerCase();
    if (statusMap[lower]) {
      this.status = statusMap[lower];
    }
  }

  // Fallback for missing category (fixing legacy data issues)
  if (!this.category) {
    this.category = "other";
  }

  next();
});

export default mongoose.model("Complaint", complaintSchema);