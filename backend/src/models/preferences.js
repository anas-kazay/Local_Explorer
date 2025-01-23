const mongoose = require("mongoose");

const preferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    weather: {
      type: String,
      required: true,
    },
    temperature: {
      type: String,
      enum: ["cold", "hot", "medium"],
      required: true,
    },
    activity: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      enum: ["morning", "noon", "evening", "night", "after midnight"],
      required: true,
    },
    placeName: {
      //cafe:starbock
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Preferences = mongoose.model("Preferences", preferencesSchema);
module.exports = Preferences;
