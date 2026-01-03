const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * HR/Admin: Get all employees
 */
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const users = await User.find().select("-password");
  res.json(users);
});

/**
 * Employee: Get own profile
 */
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

module.exports = router;
