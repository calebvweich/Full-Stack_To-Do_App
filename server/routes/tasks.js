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

// New Group
router.post("/newGroup", auth, async (req, res) => {
  try {
    const { name } = req.body;
    const newGroup = new group({
      userId: req.user.id,
      name: name
    })
    await newGroup.save();
    res.status(201).json(newGroup)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// Get Tasks
router.get("/getTasks", auth, async (req, res) => {
  try {
    const userTasks = await task.find({ userId: req.user.id })
    res.json(userTasks)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// Get Groups
router.get("/getGroups", auth, async (req, res) => {
  try {
    const userGroups = await group.find({ userId: req.user.id })
    res.json(userGroups)
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// Delete Task
router.delete("deleteTask", auth, async (req, res) => {
  try {
    const deleteId = req.body
    await task.deleteOne({ _id: deleteId })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

// Delete Group
router.delete("deleteGroup", auth, async (req, res) => {
  try {
    const deleteId = req.body
    await group.deleteOne({ _id: deleteId })
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
})

export default router;