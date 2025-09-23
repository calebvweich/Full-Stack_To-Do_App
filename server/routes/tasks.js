import express from "express";
import task from "../models/task.js";
import group from "../models/group.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// New Task
router.post("/newTask", auth, async (req, res) => {
  try {
    const { title, group, steps, dueDate } = req.body;
    const newTask = new task({
      userId: req.user.id,
      title: title,
      status: "Not-Started",
      group: group,
      steps: steps,
      dueDate: dueDate,
    })
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

export default router;