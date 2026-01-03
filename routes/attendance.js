const express = require("express");
const Attendance = require("../models/Attendance");
const auth = require("../middleware/auth");

const router = express.Router();

/**
 * Employee: Check-in
 */
router.post("/checkin", auth, async (req, res) => {
  const today = new Date().toISOString().split("T")[0];

  const attendance = await Attendance.create({
    employee: req.user.id,
    date: today,
    checkIn: new Date().toLocaleTimeString(),
  });

  res.json(attendance);
});

/**
 * Employee: Get own attendance
 */
router.get("/me", auth, async (req, res) => {
  const records = await Attendance.find({ employee: req.user.id });
  res.json(records);
});

/**
 * HR/Admin: Get all attendance
 */
router.get("/", auth, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  const records = await Attendance.find().populate(
    "employee",
    "firstName lastName employeeId"
  );

  res.json(records);
});

module.exports = router;
