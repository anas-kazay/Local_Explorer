const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Access denied" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Store the user ID in req.user
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
