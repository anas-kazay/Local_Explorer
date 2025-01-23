const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  preferences: {
    location: { type: String, default: "" },
    activity: { type: String, default: "" },
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
