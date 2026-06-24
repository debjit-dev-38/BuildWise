/**
 * models/enrollment.model.js  — MODIFIED
 *
 * Changes from original:
 *   • Added index { user: 1, status: 1, completedAt: -1 } for the
 *     monthly-projects-shipped countDocuments query in dashboard controller.
 *   • No schema shape changes — all existing fields preserved.
 *
 * NOTE: The compound unique index { user: 1, project: 1 } that already
 * exists in your DB is preserved here (unique: true on those paths).
 */

import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    status: {
      type: String,
      enum: ["Completed", "Enrolled"],
      default: "Enrolled",
    },

    completedModules: [
      {
        type: Schema.Types.ObjectId,
      },
    ],

    currentModule: {
      type: Schema.Types.ObjectId,
      default: null,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    lastAccessedAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    certificateIssued: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Existing unique index — preserves one enrollment per (user, project).
enrollmentSchema.index({ user: 1, project: 1 }, { unique: true });

// NEW: supports the monthly shipped-projects countDocuments query:
//   Enrollment.countDocuments({ user, status: "Completed", completedAt: { $gte: monthStart } })
enrollmentSchema.index({ user: 1, status: 1, completedAt: -1 });

export const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
