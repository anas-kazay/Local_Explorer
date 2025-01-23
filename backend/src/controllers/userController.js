const User = require("../models/user");

// Update Preferences
exports.updatePreferences = async (req, res) => {
  const { location, activity } = req.body;
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.preferences.location = location || user.preferences.location;
    user.preferences.activity = activity || user.preferences.activity;

    await user.save();

    res.status(200).json({ message: "Preferences updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUsernameByToken = async (req, res) => {
  const { userId } = req.user;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
