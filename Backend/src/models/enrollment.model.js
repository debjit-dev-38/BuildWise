import mongoose, { Schema } from "mongoose";

const enrollmentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: [
        "active",
        "completed",
        "paused",
        "dropped",
      ],
      default: "active",
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
      default: Date.now,
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

// One user can enroll in one project only once
enrollmentSchema.index(
  {
    user: 1,
    project: 1,
  },
  {
    unique: true,
  }
);

export const Enrollment = mongoose.model(
  "Enrollment",
  enrollmentSchema
);