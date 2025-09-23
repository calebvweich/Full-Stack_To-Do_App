import express from "express";
import task from "../models/task.js";
import group from "../models/group.js";

const router = express.Router();

// New Task
router.post("/newTask", async (req, res) => {
  try {
    const newTask = new task(req.body)
    await newTask.save();
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

export default router;