const express = require("express");
const Leave = require("../models/Leave");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/**
 * ======================================================
 * EMPLOYEE: APPLY FOR LEAVE
 * POST /api/leave
 * ======================================================
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { type, startDate, endDate, reason } = req.body;

    if (!type || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const leave = await Leave.create({
      employee: req.user.id,
      type,
      startDate,
      endDate,
      reason: reason || "",
      status: "pending",
    });

    // IMPORTANT: return object (employee page expects object)
    return res.status(201).json(leave);
  } catch (err) {
    console.error("Apply Leave Error:", err);
    return res.status(500).json({ message: "Failed to apply leave" });
  }
});

/**
 * ======================================================
 * GET LEAVES
 * - HR/Admin: gets ALL leaves
 * - Employee: gets ONLY own leaves
 * GET /api/leave
 * ======================================================
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    let leaves = [];

    if (req.user.role === "admin") {
      leaves = await Leave.find()
        .populate("employee", "firstName lastName email employeeId")
        .sort({ createdAt: -1 });
    } else {
      leaves = await Leave.find({ employee: req.user.id }).sort({
        createdAt: -1,
      });
    }

    // 🚨 CRITICAL: RETURN ARRAY ONLY (frontend safety)
    return res.json(leaves);
  } catch (err) {
    console.error("Fetch Leaves Error:", err);
    return res.status(500).json([]);
  }
});

/**
 * ======================================================
 * HR / ADMIN: APPROVE LEAVE
 * PUT /api/leave/:id/approve
 * ======================================================
 */
router.put("/:id/approve", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    return res.json(leave);
  } catch (err) {
    console.error("Approve Leave Error:", err);
    return res.status(500).json({ message: "Failed to approve leave" });
  }
});

/**
 * ======================================================
 * HR / ADMIN: REJECT LEAVE
 * PUT /api/leave/:id/reject
 * ======================================================
 */
router.put("/:id/reject", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    return res.json(leave);
  } catch (err) {
    console.error("Reject Leave Error:", err);
    return res.status(500).json({ message: "Failed to reject leave" });
  }
});

module.exports = router;
