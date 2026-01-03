const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const {
      employeeId,
      firstName,
      lastName,
      email,
      password,
      role,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      employeeId,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role?.toLowerCase() || "employee",
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Registration failed" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        employeeId: user.employeeId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        address: user.address || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
});

// ================= GET PROFILE =================
router.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
});

// ================= UPDATE PROFILE =================
router.put("/profile", authMiddleware, async (req, res) => {
  const { phone, address } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { phone, address },
    { new: true }
  ).select("-password");

  res.json(updatedUser);
});

module.exports = router;
