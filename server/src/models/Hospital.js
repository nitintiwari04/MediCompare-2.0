const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    specialties: [
      {
        type: String,
        trim: true,
      },
    ],

    facilities: [
      {
        type: String,
        trim: true,
      },
    ],

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    location: {
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Hospital", hospitalSchema);