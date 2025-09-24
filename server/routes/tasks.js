import express from "express";
import task from "../models/task.js";
import group from "../models/group.js";
import { auth } from "../middleware/auth.js";
import task from "../models/task.js";

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
    userTasks.forEach(task => {
      task.steps.sort((a, b) => a.order - b.order)
    })
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
router.delete('/task/:id', async (req, res) => {
  await task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Delete Group
router.delete('/group/:id', async (req, res) => {
  await group.findByIdAndDelete(req.params.id);
  res.json({ message: "Group deleted" });
});

// Reorder Steps
router.patch("/:taskId/steps/reorder", async (req, res) => {
  const { taskId } = req.params;
  const { order } = req.body; // array of step IDs

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Reorder steps based on given array
    const stepsMap = new Map(task.steps.map(step => [step._id.toString(), step]));
    task.steps = order.map((id, index) => {
      const step = stepsMap.get(id);
      if (step) step.order = index; // update order number
      return step;
    });

    await task.save();
    res.json(task.steps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;