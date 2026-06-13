import mongoose, { Schema } from "mongoose";

const techSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    iconKey: {
      type: String,
      default: "",
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

    num: {
      type: Number,
      default: 0,
    },

    label: {
      type: String,
      required: true,
    },

    iconKey: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const featureSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      default: "",
    },

    iconKey: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const moduleSchema = new Schema(
  {
    phase: {
      type: String,
      required: true,
    },

    weeks: {
      type: String,
      default: "",
    },

    desc: {
      type: String,
      default: "",
    },

    duration: {
      type: String,
      default: "",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    pdfUrl: {
      type: String,
      default: "",
    },

    pdfName: {
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
    src: {
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

    body: {
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

    image: {
      type: String,
      default: "",
    },

    color: {
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

    cover: {
      type: String,
      default: "",
    },

    problem: {
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

    stack: [techSchema],

    metrics: [metricSchema],

    features: [featureSchema],

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

    newest: {
      type: Boolean,
      default: false,
    },

    recommended: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: [
        "draft",
        "in-progress",
        "completed",
        "coming-soon",
      ],
      default: "draft",
    },

    relatedProjectIds: [
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