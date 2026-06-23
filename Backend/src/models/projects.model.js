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
    pdfUrl: {
      type: String,
      default: "",
    },

    pdfName: {
      type: String,
      default: "",
    },

    // Added: Cloudinary public_id for the module PDF.
    // Required for server-side deletion and asset management.
    // Empty string default preserves compatibility with existing documents.
    pdfPublicId: {
      type: String,
      default: "",
    },

    locked: {  //delete later
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

// Modified: gallerySchema now stores Cloudinary metadata instead of a raw src URL.
// url replaces src as the CDN delivery URL (field renamed to align with frontend state).
// publicId and originalName are added for Cloudinary asset management.
// caption is unchanged.
// _id: false preserved to avoid unnecessary subdocument IDs.
const gallerySchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      default: "",
    },

    originalName: {
      type: String,
      default: "",
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

// Subdocument schema for the cover image Cloudinary metadata.
// Used as an embedded object under projectSchema.cover.
// _id: false avoids a redundant subdocument ID on a single embedded object.
const coverSchema = new Schema(
  {
    url: {
      type: String,
      default: "",
    },

    publicId: {
      type: String,
      default: "",
    },

    originalName: {
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

    // Modified: cover was a flat String.
    // Now an embedded object (coverSchema) storing url, publicId, and originalName.
    // Field name is unchanged. Default produces an empty object with empty string fields,
    // which is safe for existing documents — Mongoose fills missing subdoc fields with defaults.
    cover: {
      type: coverSchema,
      default: () => ({ url: "", publicId: "", originalName: "" }),
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

// ======================
// INDEXES
// ======================

// slug already has a unique constraint above which creates an index implicitly.
// Declaring it here explicitly makes the intent clear and allows index options to be set centrally.
projectSchema.index({ category: 1 });
projectSchema.index({ difficulty: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ status: 1 });

export const Project = mongoose.model("Project", projectSchema);