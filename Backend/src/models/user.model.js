import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

const userStatsSchema = new Schema({
  dayStreak: {
    value: { type: Number, default: 0 },
  },

  lastActiveDate: {
    type: Date,
    default: null,
  },

  projectsShipped: {
    value: { type: Number, default: 0 },
  },

  hoursLearned: {
    value: { type: Number, default: 0 },
  },

  currentLevel: {
    value: { type: Number, default: 1 },
  },

  xp: {
    type: Number,
    default: 0,
  },
});


const userSchema = new Schema(
  {
    // ======================
    // AUTH
    // ======================

    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
      validate: {
        validator: validator.isEmail,
        message: "Invalid email address",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 3,
      select: false,
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },

    // ======================
    // PROFILE
    // ======================

    fullName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: "",
    },

    avatar: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    github: {
      type: String,
      default: "",
    },

    linkedin: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    // ======================
    // AUTHORIZATION
    // ======================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ======================
    // ACCOUNT STATUS
    // ======================

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    userStats: {
      type: userStatsSchema,
      default: () => ({})
    }
  },
  {
    timestamps: true,
  }
);


// ======================
// PASSWORD HASHING
// ======================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return
  }

  this.password = await bcrypt.hash(this.password, 10);

});

// ======================
// METHODS
// ======================

userSchema.methods.isPasswordCorrect = async function (
  password
) {
  return await bcrypt.compare(
    password,
    this.password
  );
};

userSchema.methods.generateAccessToken =
  function () {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn:
          process.env.ACCESS_TOKEN_EXPIRY,
      }
    );
  };

userSchema.methods.generateRefreshToken =
  function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn:
          process.env.REFRESH_TOKEN_EXPIRY,
      }
    );
  };

// ======================
// SAFE JSON RESPONSE
// ======================

userSchema.methods.toJSON = function () {
  const user = this.toObject();

  delete user.password;
  delete user.refreshToken;

  return user;
};




export const User = mongoose.model(
  "User",
  userSchema
);