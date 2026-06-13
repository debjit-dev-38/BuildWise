import mongoose, { Schema } from "mongoose";

const techSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const metricSchema = new Schema(
  {
    value: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const featureSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const moduleSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    locked: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const gallerySchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const challengeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    // ======================
    // BASIC INFO
    // ======================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    duration: {
      type: String,
      default: "",
    },

    durationWeeks: {
      type: Number,
      default: 0,
    },

    projectImageKey: {
      type: String,
      default: "",
    },

    themeColor: {
      type: String,
      enum: ["green", "indigo", "amber", "pink"],
      default: "green",
    },

    // ======================
    // CONTENT
    // ======================

    summary: {
      type: String,
      default: "",
    },

    coverImageUrl: {
      type: String,
      default: "",
    },

    problemStatement: {
      type: String,
      default: "",
    },

    solution: {
      type: String,
      default: "",
    },

    // ======================
    // TECH & FEATURES
    // ======================

    techStack: [techSchema],

    metrics: [metricSchema],

    keyFeatures: [featureSchema],

    // ======================
    // MODULES
    // ======================

    modules: [moduleSchema],

    // ======================
    // MEDIA
    // ======================

    gallery: [gallerySchema],

    challenges: [challengeSchema],

    // ======================
    // PUBLISH SETTINGS
    // ======================

    featured: {
      type: Boolean,
      default: false,
    },

    isNewProject: {
      type: Boolean,
      default: false,
    },

    recommended: {
      type: Boolean,
      default: false,
    },

    developmentStatus: {
      type: String,
      enum: [
        "draft",
        "in_progress",
        "completed",
        "coming_soon",
      ],
      default: "draft",
    },

    relatedProjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],

    isPublished: {
      type: Boolean,
      default: false,
    },

    publishedAt: Date,

    // ======================
    // ADMIN
    // ======================

    // createdBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model("Project", projectSchema);